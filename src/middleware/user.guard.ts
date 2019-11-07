import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    console.log(roles);
    if (!roles) {
      return false;
    }

    return roles.some(role => role === 'user');

    // let user = this.usersService.findOneByEmail(payload.email);
    // console.log(user);
    // if (user.role === 'admin') {
    //   return this.createJwtPayload(user);
    // } else {
    //   throw new UnauthorizedException();
    // }
  }
}
