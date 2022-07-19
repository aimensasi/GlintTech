import { Controller, Get, Query } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { TopRankingDto } from './dto';

@Controller('restaurants')
export class RestaurantController {
  constructor(private restaurantService: RestaurantService) {}

  @Get()
  index() {
    return this.restaurantService.index();
  }

  @Get('rankings')
  rankings(@Query() filter: TopRankingDto) {
    return this.restaurantService.rankings(filter);
  }

  @Get('search')
  search(@Query('query') query: string) {
    return this.restaurantService.search(query);
  }
}
