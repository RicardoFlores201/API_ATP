import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Player } from '../../players/schemas/player.schema.js';


export type RankingDocument = HydratedDocument<Ranking>;

@Schema({ timestamps: false, versionKey: false })
export class Ranking {
    @Prop({ required: true })
    date: Date;

    @Prop({ required: true })
    position: number;

    @Prop({ required: true })
    playerId: number;             

    @Prop()
    points?: number;
}

export const RankingSchema = SchemaFactory.createForClass(Ranking);

// Un jugador aparece una sola vez por semana
// "ranking más reciente": date desc
RankingSchema.index({ date: -1, playerId: 1 }, { unique: true });

// Ordenar por posición dentro de una fecha
RankingSchema.index({ date: -1, position: 1 });

// Historial de un jugador ordenado por fecha
RankingSchema.index({ playerId: 1, date: -1 });

// Relación con Player
RankingSchema.virtual('player', {
    ref: Player.name,
    localField: 'playerId',
    foreignField: 'atpId',
    justOne: true,
});
RankingSchema.set('toJSON', { virtuals: true });