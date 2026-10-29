import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { TournamentCategory } from '../enums/tournament-category.enum.js';
import { Surface } from '../enums/tournament-surface.enum.js';

export type TournamentDocument = HydratedDocument<Tournament>;

@Schema({ timestamps: true })
export class Tournament {
    @Prop({ required: true, unique: true })
    tourneyId: string;

    @Prop({ required: true })
    name: string;

    @Prop({ required: true, enum: TournamentCategory, index: true })
    category: TournamentCategory;

    @Prop({ enum: Surface, index: true })
    surface?: Surface;

    @Prop({ required: true, index: true })
    startDate: Date;

    @Prop({ required: true, index: true })
    year: number;

    @Prop()
    drawSize?: number;

    @Prop()
    city?: string;

    @Prop()
    country?: string;
}

export const TournamentSchema = SchemaFactory.createForClass(Tournament);
TournamentSchema.index({ name: 'text' });
