import { Module } from '@nestjs/common';
import { RankingsService } from './rankings.service.js';
import { RankingsController } from './rankings.controller.js';

@Module({
  providers: [RankingsService],
  controllers: [RankingsController],
})
export class RankingsModule {}
