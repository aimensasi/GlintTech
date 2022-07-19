import { IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderDto {
  @IsNotEmpty()
  @Type(() => Number)
  restaurantId: number;

  @IsNotEmpty()
  @IsString()
  dishName: string;
}
