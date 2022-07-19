import { IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class OrderDto {
  @IsNotEmpty()
  @Type(() => Number)
  @ApiProperty({ required: true })
  restaurantId: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true })
  dishName: string;
}
