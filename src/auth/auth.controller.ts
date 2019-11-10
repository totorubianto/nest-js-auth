import { Controller, Post, Body,UseFilters,UseInterceptors,UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { TransformInterceptor } from '../middleware/interceptor/transform.interceptor';
import {HttpExceptionFilter} from '../middleware/filter/http-exception.filter'
import {ValidationPipe} from '../middleware/pipe/validate.pipe'
@Controller('auth')
@UsePipes(ValidationPipe)
@UseFilters(HttpExceptionFilter)
@UseInterceptors(TransformInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  async login(@Body() loginUserDto: LoginUserDto) {
    return await this.authService.validateUserByPassword(loginUserDto);
  }
}
