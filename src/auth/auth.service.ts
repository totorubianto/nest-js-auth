import {
  Injectable,
  UnauthorizedException,
  Request,
  Response,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import * as JWT from 'jwt-decode';
import { Auth } from './interfaces/jwt.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('Auth') private readonly authModel: Model<Auth>,
    private usersService: UsersService,
    private jwtService: JwtService,
    ) {}
    
    async validateUserByPassword(loginAttempt: LoginUserDto) {
      let userToAttempt = await this.usersService.findOneByEmail(loginAttempt.email);
      
        try {
          const isMatch = await bcrypt.compare(loginAttempt.password, userToAttempt.password);
            if (!isMatch)  throw new HttpException({
              data:{
                message: "Input data validation failed",
                errors: {
                    password: "password yang anda masukan salah",
                }
              }
            },  HttpStatus.BAD_REQUEST);
        
              const data = this.createJwtPayload(userToAttempt);
              let jwtData = JWT(data.token);
              const saveToken = {
                token: data.token,
                user: jwtData._id,
                expiresIn: jwtData.exp,
              };
              const newItem = new this.authModel(saveToken);
              const result = newItem.save();
              return result
        } catch (error) {
          throw new HttpException(error.message, error.status);
        }
      }
      
      async findTokenEmail(token): Model<Auth> {
        const tokenNotBearer = token.replace('Bearer ', '');
        try {
          const data = await this.authModel.findOne({ token: tokenNotBearer });
          return data;
        } catch (error) {
          throw new UnauthorizedException();
        }
      }
      
      async validateUserByJwt(payload: JwtPayload, token: string) {
        let user = await this.findTokenEmail(token);
        if (user) {
          const data = JWT(user.token);
          const expiresIn = data.exp * 1000;
          
          if (expiresIn > Date.now()) {
            return this.createJwtPayload(payload);
          } else {
            throw new UnauthorizedException();
          }
        } else {
          throw new UnauthorizedException();
        }
      }
      
      createJwtPayload(user) {
        let data: JwtPayload = {
          _id: user._id,
          email: user.email,
          role: user.role,
        };
        let jwt = this.jwtService.sign(data);
        
        return {
          expiresIn: 3600,
          token: jwt,
        };
      }
    }
    