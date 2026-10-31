import { Type } from 'class-transformer';
import {IsDate, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Length, Max, Min, Matches,} from 'class-validator';

export class CreatePlayerDto {
    @IsInt()
    @Min(1)
    atpId: number;

    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsOptional()
    @IsNotEmpty()
    age: number;

    @IsOptional()
    @IsString()
    @Length(3, 3)
    @Matches(/^[A-Z]{3}$/, { message: 'country debe ser un código IOC en mayúsculas (ej. MEX)' })
    country?: string;

    @IsOptional()
    @Type(() => Date)
    @IsDate()
    birthDate?: Date;

    @IsOptional()
    @IsIn(['R', 'L', 'U'])
    hand?: string;

    @IsOptional()
    @IsInt()
    @Min(140)
    @Max(230)
    height?: number;
}
