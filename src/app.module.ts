import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayersModule } from './players/players.module.js';
import { TournamentsModule } from './tournaments/tournaments.module.js';
import { MatchesModule } from './matches/matches.module.js';
import { RankingsModule } from './rankings/rankings.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
        maxPoolSize: 5,
      }),
    }),
    PlayersModule,
    TournamentsModule,
    MatchesModule,
    RankingsModule,
  ],
})
export class AppModule {}