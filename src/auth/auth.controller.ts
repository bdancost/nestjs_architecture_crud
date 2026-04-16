import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { LoginRequestBody } from './model/LoginRequestBody';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  login(@Body() { email, password }: LoginRequestBody) {
    return this.authService.login(email, password);
  }
}
