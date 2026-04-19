/* eslint-disable @typescript-eslint/no-unsafe-call */

/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { of } from 'rxjs';
import { map, mergeMap, takeWhile, tap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { UserService } from '../users/users.service';
import { UserFromJwt } from './model/UserFromJwt';
import { AuthRequest } from './model/AuthRequest';
import { IS_PUBLIC_KEY } from './public.decorator';
import { User } from '../users/entities/user.entity';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private reflector: Reflector,
    @Inject(UserService) private readonly userService: UserService,
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const canActivate = super.canActivate(context);

    if (typeof canActivate === 'boolean') {
      return canActivate;
    }

    return of(canActivate).pipe(
      mergeMap((value) => value),
      takeWhile((value) => value),
      map(() => context.switchToHttp().getRequest<AuthRequest>()),
      mergeMap((request) => {
        const reqUser = request.user as UserFromJwt & { userId: number };
        if (!reqUser) {
          throw Error('User was not found in request.');
        }
        if (typeof reqUser.userId !== 'number') {
          throw new Error('User ID is missing or invalid in JWT.');
        }
        return this.userService.findById(reqUser.userId).pipe(
          tap((user: User) => {
            request.principal = user;
          }),
        );
      }),
      map((user) => Boolean(user)),
    );
  }
}
