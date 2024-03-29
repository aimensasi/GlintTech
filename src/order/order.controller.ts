import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderDto } from './dto';
import { User } from '@prisma/client';
import { GetUserDecorator } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { ApiBody } from '@nestjs/swagger';

@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post()
  @UseGuards(JwtGuard)
  @ApiBody({ type: OrderDto })
  create(@Body() data: OrderDto, @GetUserDecorator() user: User) {
    return this.orderService.create(user, data);
  }
}
