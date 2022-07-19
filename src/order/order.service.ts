import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OrderDto } from './dto';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { restaurants } from '../../prisma/data/restaurants';

@Injectable()
export class OrderService {
  constructor(private prismaService: PrismaService) {}

  async create(user: User, data: OrderDto) {
    const restaurant = await this.prismaService.restaurant.findFirst({
      where: { id: data.restaurantId },
      include: {
        dishes: true,
      },
    });

    if (!restaurant) {
      throw new NotFoundException('Restaurant was not found');
    }

    const dish = restaurant.dishes.find(
      (dish) => dish.name.toLowerCase() === data.dishName.toLowerCase(),
    );

    if (!dish) {
      throw new NotFoundException('Restaurant is out of this dish');
    }

    if (dish.price > user.cashBalance) {
      throw new BadRequestException('Insufficient fund to proceed');
    }

    const result = await this.prismaService.$transaction([
      this.prismaService.order.create({
        data: {
          restaurantId: restaurant.id,
          userId: user.id,
          dishName: dish.name,
          price: dish.price,
        },
      }),

      this.prismaService.user.update({
        where: { id: user.id },
        data: { cashBalance: user.cashBalance.sub(dish.price) },
      }),

      this.prismaService.restaurant.update({
        where: { id: restaurant.id },
        data: { cashBalance: restaurant.cashBalance.add(dish.price) },
      }),
    ]);

    return {
      message: 'Order is in the kitchen',
      orderId: result[0].id,
    };
  }
}
