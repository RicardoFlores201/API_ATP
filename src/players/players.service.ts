import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter } from 'mongoose';

import { isDuplicateKeyError, paginate, PaginationQueryDto } from '../common/index.js';
import { CreatePlayerDto, FindPlayersQueryDto, UpdatePlayerDto } from './dto/index.js';
import { Player } from './schemas/player.schema.js';
import { Match } from '../matches/schemas/match.schema.js';
import { Ranking } from '../rankings/schemas/ranking.schema.js';

const PLAYER_SUMMARY = 'atpId firstName lastName country';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel(Player.name) private readonly playerModel: Model<Player>,
    @InjectModel(Match.name) private readonly matchModel: Model<Match>,
    @InjectModel(Ranking.name) private readonly rankingModel: Model<Ranking>,
  ) {}

  async findAll({ page, limit, country, hand, search }: FindPlayersQueryDto) {
    const filter: QueryFilter<Player> = {};
    if (country) filter.country = country;
    if (hand) filter.hand = hand;
    if (search) filter.$text = { $search: search };

    const query = this.playerModel.find(filter, search ? { score: { $meta: 'textScore' } } : {});
    query.sort(search ? { score: { $meta: 'textScore' } } : { lastName: 1, firstName: 1 });

    const [data, total] = await Promise.all([
      query.skip((page - 1) * limit).limit(limit).lean(),
      this.playerModel.countDocuments(filter),
    ]);
    return paginate(data, total, page, limit);
  }

  async findOne(atpId: number) {
    const player = await this.playerModel.findOne({ atpId }).lean();
    if (!player) throw new NotFoundException(`Jugador ${atpId} no encontrado`);
    return player;
  }

  async findMatches(atpId: number, { page, limit }: PaginationQueryDto) {
    await this.ensureExists(atpId);
    const filter = { $or: [{ winnerId: atpId }, { loserId: atpId }] };

    const [data, total] = await Promise.all([
      this.matchModel
        .find(filter)
        .sort({ date: -1, matchNum: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('tournament', 'tourneyId name category surface')
        .populate('winner', PLAYER_SUMMARY)
        .populate('loser', PLAYER_SUMMARY),
      this.matchModel.countDocuments(filter),
    ]);
    return paginate(data, total, page, limit);
  }

  async findRankingHistory(atpId: number) {
    await this.ensureExists(atpId);
    return this.rankingModel
      .find({ playerId: atpId }, { _id: 0, date: 1, position: 1, points: 1 })
      .sort({ date: 1 })
      .lean();
  }

  async create(dto: CreatePlayerDto) {
    try {
      return await this.playerModel.create(dto);
    } catch (err) {
      if (isDuplicateKeyError(err)) {
        throw new ConflictException(`Ya existe un jugador con atpId ${dto.atpId}`);
      }
      throw err;
    }
  }

  async update(atpId: number, dto: UpdatePlayerDto) {
    const player = await this.playerModel
      .findOneAndUpdate({ atpId }, { $set: dto }, { new: true, runValidators: true })
      .lean();
    if (!player) throw new NotFoundException(`Jugador ${atpId} no encontrado`);
    return player;
  }

  private async ensureExists(atpId: number) {
    const exists = await this.playerModel.exists({ atpId });
    if (!exists) throw new NotFoundException(`Jugador ${atpId} no encontrado`);
  }
}