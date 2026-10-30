import { Module } from '@nestjs/common';
import { MatchesService } from './matches.service.js';
import { MatchesController } from './matches.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Match, MatchSchema } from './schemas/match.schema.js';

@Module({
  controllers: [MatchesController],
  providers: [MatchesService],
  imports: [MongooseModule.forFeature([{name: Match.name, schema: MatchSchema}])]
})
export class MatchesModule {}
