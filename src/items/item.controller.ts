import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Put,
  Param,
  HttpException,
  HttpStatus,
  SetMetadata,
  UseFilters,
  UsePipes,
  UseGuards,
  Res,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { ItemService } from './item.services';
import { CreateItemDto } from './dto/create-item.dto';
import { Item } from './interfaces/item.interface';
import { HttpExceptionFilter } from '../middleware/http-exception.filter';

@Controller()

// @UseInterceptors(ErrorsInterceptor)
// @UseInterceptors(CacheInterceptor)
// @UseInterceptors(TimeoutInterceptor)
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get('item')
  findAll(): Promise<Item[]> {
    return this.itemService.findAll();
  }

  @Get('item/exception')
  exception(): Promise<Item[]> {
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }

  @Get('item/custom-exception')
  async customException() {
    throw new HttpException(
      {
        status: HttpStatus.FORBIDDEN,
        error: 'This is a custom message',
      },
      403,
    );
  }

  @Get('item/:id')
  findOne(@Param('id') id): Promise<Item> {
    return this.itemService.findOne(id);
  }

  @Post('item')
  create(@Body() createItemDto: CreateItemDto) {
    return this.itemService.create(createItemDto);
  }

  @Delete('item/:id')
  delete(@Param('id') id): Promise<Item> {
    return this.itemService.delete(id);
  }

  @Put('item/:id')
  update(@Body() updateItemDto: CreateItemDto, @Param('id') id): Promise<Item> {
    return this.itemService.update(id, updateItemDto);
  }
}
