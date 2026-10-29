import { Module } from '@nestjs/common';
import { PlayersService } from './players.service.js';
import { PlayersController } from './players.controller.js';
import { MongooseModule } from '@nestjs/mongoose';
import { Player, PlayerSchema } from './schemas/player.schema.js';

@Module({
  controllers: [PlayersController],
  providers: [PlayersService],
  imports: [
    MongooseModule.forFeature([{ name: Player.name, schema: PlayerSchema }]),
  ],
  exports: [MongooseModule],
})
export class PlayersModule {}
