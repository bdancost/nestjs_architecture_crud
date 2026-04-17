/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UserService } from 'src/users/users.service';

import * as bcrypt from 'bcrypt';
import { UserPayload } from './model/UserPayload';
import { UserToken } from './model/UserToken';
import { UnauthorizedError } from '../errors/UnathorizedError';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}
  async login(email: string, password: string): Promise<UserToken> {
    const user: User = await this.validateUser(email, password);

    const payload: UserPayload = {
      username: user.email,
      sub: user.id,
    };

    return { access_token: this.jwtService.sign(payload) };
  }

  private async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (user) {
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (isPasswordValid) {
        return {
          ...user,
          password: undefined,
        };
      }
    }

    throw new UnauthorizedError(
      'Email address or password provided is incorrect.',
    );
  }
}
