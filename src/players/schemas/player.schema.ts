import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type PlayerDocument = HydratedDocument<Player>;

@Schema({ timestamps: true })
export class Player {
    @Prop({ required: true, unique: true })
    atpId: number;

    @Prop({ required: true })
    firstName: string;

    @Prop({ required: true })
    lastName: string;

    @Prop({ index: true })
    country: string;

    @Prop()
    birthDate?: Date;

    @Prop({ enum: ['R', 'L', 'U'] })
    hand?: string;

    @Prop()
    height?: number;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
PlayerSchema.index({ lastName: 'text', firstName: 'text' });
