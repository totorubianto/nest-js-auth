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
  UsePipes,
  UseGuards,
  UseInterceptors,
  UseFilters,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ItemService } from './item.services';
import { CreateItemDto } from './dto/create-item.dto';
import { Item } from './interfaces/item.interface';
import { ValidationPipe } from '../middleware/pipe/validate.pipe';
import { UserCustom } from '../middleware/decorator/userLogged.decorator';
import { HttpExceptionFilter } from '../middleware/filter/http-exception.filter';
import { Roles } from '../middleware/decorator/guard.decorator';
import { RolesGuard } from '../middleware/guard/user.guard';
import { TransformInterceptor } from '../middleware/interceptor/transform.interceptor';

@Controller('item')
@UseGuards(RolesGuard)
@UsePipes(ValidationPipe)
@UseFilters(HttpExceptionFilter)
@UseInterceptors(TransformInterceptor)
// @UseInterceptors(ErrorsInterceptor)
// @UseInterceptors(CacheInterceptor)
// @UseInterceptors(TimeoutInterceptor)
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get()
  findAll(): Promise<Item[]> {
    return this.itemService.findAll();
  }

  @Get('exception')
  exception(): Promise<Item[]> {
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }

  @Get('custom-exception')
  async customException() {
    throw new HttpException(
      {
        status: HttpStatus.FORBIDDEN,
        error: 'This is a custom message',
      },
      403,
    );
  }

  @Get(':id')
  findOne(@Param('id') id): Promise<Item> {
    return this.itemService.findOne(id);
  }

  @Post('')
  @UseGuards(AuthGuard())
  @Roles('admin', 'user')
  create(@Body() createItemDto: CreateItemDto, @UserCustom() data: any) {
    return this.itemService.create(createItemDto, data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  @Roles('admin', 'user')
  delete(@Param('id') id, @UserCustom() data: any): Promise<Item> {
    return this.itemService.delete(id, data);
  }

  @Put(':id')
  @UseGuards(AuthGuard())
  @Roles('admin', 'user')
  update(
    @Body() updateItemDto: CreateItemDto,
    @Param('id') id,
    @UserCustom() data: any,
  ): Promise<any> {
    return this.itemService.update(id, updateItemDto, data);
  }
}
