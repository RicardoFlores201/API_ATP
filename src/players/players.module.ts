import { Module } from '@nestjs/common';
import { PlayersService } from './players.service.js';
import { PlayersController } from './players.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Player, PlayerSchema } from './schemas/player.schema.js';
import { Match, MatchSchema } from '../matches/schemas/match.schema.js';
import { Ranking, RankingSchema } from '../rankings/schemas/ranking.schema.js';
import { Tournament, TournamentSchema } from '../tournaments/schemas/tournament.schema.js';

@Module({
  controllers: [PlayersController],
  providers: [PlayersService],
  imports: [
    MongooseModule.forFeature([
      { name: Player.name, schema: PlayerSchema },
      { name: Match.name, schema: MatchSchema },
      { name: Ranking.name, schema: RankingSchema },
{ name: Tournament.name, schema: TournamentSchema },
    ]),
  ],
  exports: [MongooseModule],
})
export class PlayersModule {}
