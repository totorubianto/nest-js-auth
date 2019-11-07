import {
  Injectable,
  UnauthorizedException,
  Request,
  Response,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import * as JWT from 'jwt-decode';
import { Auth } from './interfaces/jwt.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('Auth') private readonly authModel: Model<Auth>,
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUserByPassword(loginAttempt: LoginUserDto) {
    let userToAttempt = await this.usersService.findOneByEmail(
      loginAttempt.email,
    );

    return new Promise(resolve => {
      userToAttempt.checkPassword(loginAttempt.password, (err, isMatch) => {
        if (err) throw new UnauthorizedException();

        if (isMatch) {
          const data = this.createJwtPayload(userToAttempt);
          let jwtData = JWT(data.token);

          //   var seconds = Math.floor(Date.now() / 1000);
          //   if (jwtData.iat === seconds) {
          //     console.log(true);
          //   } else {
          //     console.log(false);
          //   }
          const saveToken = {
            token: data.token,
            user: jwtData._id,
            expiresIn: jwtData.exp,
          };
          const newItem = new this.authModel(saveToken);
          newItem.save();
          resolve(saveToken);
        } else {
          throw new UnauthorizedException();
        }
      });
    });
  }

  async findTokenEmail(token): Model<Auth> {
    const tokenNotBearer = token.replace('Bearer ', '');
    try {
      const data = await this.authModel.findOne({ token: tokenNotBearer });
      return data;
    } catch (error) {
      throw Error('data gk ada');
    }
  }

  async validateUserByJwt(payload: JwtPayload, token: string) {
    let user = await this.findTokenEmail(token);

    if (user) {
      const data = JWT(user.token);
      const expiresIn = data.exp * 1000;
      const now = new Date();
      console.log(expiresIn, now);
      if (expiresIn > now.getTime()) {
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
