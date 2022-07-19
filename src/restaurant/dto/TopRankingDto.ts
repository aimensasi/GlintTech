import { IsIn, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class TopRankingDto {
  @IsNotEmpty()
  @IsIn(['more', 'less'])
  rankingType: string;

  @Type(() => Number)
  @IsNotEmpty()
  price: number;

  @Type(() => Number)
  @IsNotEmpty()
  dishes: number;
}
