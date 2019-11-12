import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  UsePipes,
  UseInterceptors,
  UseFilters,
} from '@nestjs/common';

import { BuyService } from './buyTransaction.service';
import { ValidationPipe } from '../middleware/pipe/validate.pipe';
import { RolesGuard } from '../middleware/guard/user.guard';
import { TransformInterceptor } from '../middleware/interceptor/transform.interceptor';
import { HttpExceptionFilter } from '../middleware/filter/http-exception.filter';

@Controller('buyitem')
@UsePipes(ValidationPipe)
@UseFilters(HttpExceptionFilter)
@UseInterceptors(TransformInterceptor)
@UseGuards(RolesGuard)
export class BuyController {
  constructor(private buyService: BuyService) {}

  @Get()
  findAll(): Promise<any[]> {
    return this.buyService.findAll();
  }

  @Post()
  async create(@Body() createBuyTransaction: any) {
    return await this.buyService.create(createBuyTransaction);
  }
}
