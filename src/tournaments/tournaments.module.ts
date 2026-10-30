import { Module } from '@nestjs/common';
import { TournamentsService } from './tournaments.service.js';
import { TournamentsController } from './tournaments.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Tournament, TournamentSchema } from './schemas/tournament.schema.js';

@Module({
  controllers: [TournamentsController],
  providers: [TournamentsService],
  imports: [MongooseModule.forFeature([{name: Tournament.name, schema: TournamentSchema}])]
})
export class TournamentsModule {}
