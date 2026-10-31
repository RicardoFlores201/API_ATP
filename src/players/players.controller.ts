import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { FindPlayersQueryDto } from './dto/find-players-query.dto.js';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto.js';
import { ApiKeyGuard } from '../common/guard/api-key.guard.js';
import { UpdatePlayerDto } from './dto/update-player.dto.js';
import { CreatePlayerDto } from './dto/create-player.dto.js';
import { PlayersService } from './players.service.js';

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get()
  findAll(@Query() query: FindPlayersQueryDto) {
    return this.playersService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.playersService.findOne(id);
  }

  @Get(':id/matches')
  findMatches(@Param('id', ParseIntPipe) id: number, @Query() query: PaginationQueryDto) {
    return this.playersService.findMatches(id, query);
  }

  @Get(':id/ranking-history')
  findRankingHistory(@Param('id', ParseIntPipe) id: number) {
    return this.playersService.findRankingHistory(id);
  }

  @Post()
  @UseGuards(ApiKeyGuard)
  create(@Body() dto: CreatePlayerDto) {
    return this.playersService.create(dto);
  }

  @Patch(':id')
  @UseGuards(ApiKeyGuard)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdatePlayerDto) {
    return this.playersService.update(id, dto);
  }
}