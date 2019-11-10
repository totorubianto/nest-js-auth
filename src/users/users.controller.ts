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

import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { ValidationPipe } from '../middleware/pipe/validate.pipe';
import { Roles } from '../middleware/decorator/guard.decorator';
import { RolesGuard } from '../middleware/guard/user.guard';
import { UserCustom } from '../middleware/decorator/userLogged.decorator';
import { TransferDto } from '../users/dto/transfer.dto';
import { TransformInterceptor } from '../middleware/interceptor/transform.interceptor';
import { HttpExceptionFilter } from '../middleware/filter/http-exception.filter';
@Controller('users')
@UsePipes(ValidationPipe)
@UseFilters(HttpExceptionFilter)
@UseInterceptors(TransformInterceptor)
@UseGuards(RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }
  @Get()
  findAll(): Promise<any[]> {
    return this.usersService.findAll();
  }
  @Post('transfer')
  @UseGuards(AuthGuard())
  @Roles('admin', 'user')
  async transfer(@Body() data: TransferDto, @UserCustom() user: any) {
    return await this.usersService.transfer(data, user);
  }
}
