import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import type { Connection } from 'mongoose';

import { RateLimitGuard } from './common/guard/rate-limit.guard.js';
import { MatchesModule } from './matches/matches.module.js';
import { PlayersModule } from './players/players.module.js';
import { RankingsModule } from './rankings/rankings.module.js';
import { TournamentsModule } from './tournaments/tournaments.module.js';

const mongoLogger = new Logger('MongoDB');

function safeHost(uri?: string): string {
  if (!uri) return 'MONGODB_URI no definida';
  try {
    const url = new URL(uri);
    return `${url.host}${url.pathname}`;
  } catch {
    return 'MONGODB_URI con formato inválido';
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const uri = config.get<string>('MONGODB_URI');
        mongoLogger.log(`Conectando a ${safeHost(uri)}`);

        return {
          uri,
          maxPoolSize: 5,
          serverSelectionTimeoutMS: 8000,
          onConnectionCreate: (connection: Connection) => {
            connection.on('connected', () => mongoLogger.log('Conectado'));
            connection.on('disconnected', () => mongoLogger.warn('Desconectado'));
            connection.on('reconnected', () => mongoLogger.log('Reconectado'));
            connection.on('error', (err: Error) =>
              mongoLogger.error(`${err.name}: ${err.message}`),
            );
            return connection;
          },
        };
      },
    }),
    PlayersModule,
    TournamentsModule,
    MatchesModule,
    RankingsModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: RateLimitGuard }],
})
export class AppModule {}