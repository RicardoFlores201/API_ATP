import { Module } from '@nestjs/common';
import { RankingsService } from './rankings.service.js';
import { RankingsController } from './rankings.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Ranking, RankingSchema } from './schemas/ranking.schema.js';

@Module({
  providers: [RankingsService],
  controllers: [RankingsController],
  imports: [MongooseModule.forFeature([{name: Ranking.name, schema: RankingSchema}])]
})
export class RankingsModule {}
