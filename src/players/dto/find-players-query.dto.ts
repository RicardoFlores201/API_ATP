import { IsIn, IsOptional, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto.js';

export class FindPlayersQueryDto extends PaginationQueryDto {
    @IsOptional()
    @Transform(({ value }) => value?.toUpperCase())
    @IsString()
    @Length(3, 3)
    country?: string;

    @IsOptional()
    @IsIn(['R', 'L', 'U'])
    hand?: string;

    @IsOptional()
    @IsString()
    @Length(2, 50)
    search?: string;
}