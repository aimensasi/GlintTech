import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as moment from 'moment';
import { TopRankingDto } from './dto';

@Injectable()
export class RestaurantService {
  constructor(private prismaService: PrismaService) {}

  async index() {
    const now = moment().format('HH:mm');
    const currentDay = this.getCurrentDay();

    return this.prismaService.restaurant.findMany({
      where: {
        openingHours: {
          some: {
            day: currentDay,
            fromTime: { gte: now },
            toTime: { lte: now },
          },
        },
      },
      include: { openingHours: true },
    });
  }

  async rankings(filter: TopRankingDto) {
    let query: any = {
      menuSize: {
        lte: filter.dishes,
      },
      averageDishPrice: {
        lte: filter.price,
      },
    };

    if (filter.rankingType === 'more') {
      query = {
        menuSize: {
          gte: filter.dishes,
        },
        averageDishPrice: {
          gte: filter.price,
        },
      };
    }

    return this.prismaService.restaurant.findMany({
      where: query,
      orderBy: {
        name: 'asc',
      },
    });
  }

  async search(query: string) {
    return this.prismaService.restaurant.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
            },
          },
          {
            dishes: {
              some: {
                name: {
                  contains: query,
                },
              },
            },
          },
        ],
      },
    });
  }

  /**
   * This function help transfer the moment day format
   * to the dataset day format
   *
   * i.e. Thu == Thurs
   * */
  getCurrentDay() {
    const day = moment().format('ddd');

    if (day === 'Thu') return 'Thurs';

    if (day === 'Wed') return 'Weds';

    if (day === 'Tue') return 'Tues';

    return day;
  }
}
