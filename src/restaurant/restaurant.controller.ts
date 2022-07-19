import { Controller, Get, Query } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { TopRankingDto } from './dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('restaurants')
export class RestaurantController {
  constructor(private restaurantService: RestaurantService) {}

  @Get()
  index() {
    return this.restaurantService.index();
  }

  @Get('rankings')
  @ApiQuery({ name: 'filter', type: TopRankingDto })
  rankings(@Query() filter: TopRankingDto) {
    return this.restaurantService.rankings(filter);
  }

  @Get('search')
  @ApiQuery({ name: 'query', type: String })
  search(@Query('query') query: string) {
    return this.restaurantService.search(query);
  }
}
