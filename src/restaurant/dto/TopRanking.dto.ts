import { IsIn, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class TopRankingDto {
  @IsNotEmpty()
  @IsIn(['more', 'less'])
  @ApiProperty({ required: true })
  rankingType: string;

  @Type(() => Number)
  @IsNotEmpty()
  @ApiProperty({ required: true })
  price: number;

  @Type(() => Number)
  @IsNotEmpty()
  @ApiProperty({ required: true })
  dishes: number;
}
