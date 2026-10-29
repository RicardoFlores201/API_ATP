import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Tournament } from '../../tournaments/schemas/tournament.schema.js';
import { Player } from '../../players/schemas/player.schema.js';
import { Surface } from '../../tournaments/enums/tournament-surface.enum.js';
import { Round } from '../enums/match-round.enum.js';

export type MatchDocument = HydratedDocument<Match>;

@Schema({ _id: false })
export class MatchStats {
    @Prop() 
    aces?: number;

    @Prop() 
    doubleFaults?: number;

    @Prop() 
    servePoints?: number;

    @Prop() 
    firstServeIn?: number;

    @Prop() 
    firstServeWon?: number;

    @Prop() 
    secondServeWon?: number;

    @Prop() 
    serviceGames?: number;

    @Prop() 
    breakPointsSaved?: number;

    @Prop() 
    breakPointsFaced?: number;
}

const MatchStatsSchema = SchemaFactory.createForClass(MatchStats);

@Schema({ timestamps: false, versionKey: false })
export class Match {
    @Prop({ required: true })
    tourneyId: string;              

    @Prop({ required: true })
    matchNum: number;

    @Prop({ required: true })
    date: Date;                     

    @Prop({ enum: Surface })
    surface?: Surface;              

    @Prop({ required: true, enum: Round })
    round: Round;

    @Prop({ required: true })
    winnerId: number;               

    @Prop({ required: true })
    loserId: number;

    @Prop({ required: true })
    score: string;                  

    @Prop({ enum: [3, 5] })
    bestOf?: number;

    @Prop()
    minutes?: number;

    @Prop() winnerSeed?: number;
    @Prop() loserSeed?: number;
    @Prop() winnerRank?: number;    
    @Prop() loserRank?: number;

    @Prop({ type: MatchStatsSchema })
    winnerStats?: MatchStats;

    @Prop({ type: MatchStatsSchema })
    loserStats?: MatchStats;
}

export const MatchSchema = SchemaFactory.createForClass(Match);

// Identificador único del partido en el dataset
MatchSchema.index({ tourneyId: 1, matchNum: 1 }, { unique: true });

// Partidos de un jugador (ganados y perdidos)
MatchSchema.index({ winnerId: 1, date: -1 });
MatchSchema.index({ loserId: 1, date: -1 });

// Relaciones
MatchSchema.virtual('tournament', {
    ref: Tournament.name,
    localField: 'tourneyId',
    foreignField: 'tourneyId',
    justOne: true,
});

MatchSchema.virtual('winner', {
    ref: Player.name,
    localField: 'winnerId',
    foreignField: 'atpId',
    justOne: true,
});

MatchSchema.virtual('loser', {
    ref: Player.name,
    localField: 'loserId',
    foreignField: 'atpId',
    justOne: true,
});

MatchSchema.set('toJSON', { virtuals: true });