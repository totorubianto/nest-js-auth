import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import * as JWT from 'jwt-decode';
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) {
      return true;
    }
    const req = context.switchToHttp().getRequest();
    if (!req.headers['authorization']) {
      return false;
    }
    const user = JWT(req.headers['authorization']);

    return roles.some(role => role === user.role);

    // let user = this.usersService.findOneByEmail(payload.email);
    // console.log(user);
    // if (user.role === 'admin') {
    //   return this.createJwtPayload(user);
    // } else {
    //   throw new UnauthorizedException();
    // }
  }
}
