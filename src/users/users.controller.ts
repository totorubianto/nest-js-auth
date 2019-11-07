import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  UsePipes,
  Headers,
  Request,
} from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { TokenDto } from './dto/create-token.dto';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { ValidationPipe } from '../middleware/validate.pipe';
import { Roles } from '../middleware/guard.decorator';
import { RolesGuard } from '../middleware/user.guard';
@Controller('users')
@UsePipes(ValidationPipe)
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
  @Get('test')
  @UseGuards(AuthGuard())
  testAuthRoute(@Headers() token: TokenDto, @Request() req) {
    const dataToken = token['authorization'];
    return {
      message: 'Kamu dapat akses',
    };
  }
}
