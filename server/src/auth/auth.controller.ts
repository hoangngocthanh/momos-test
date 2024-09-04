import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LoginByEmailDto } from 'src/user/dto/login-by-email.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  signIn(@Body() signInDto: LoginByEmailDto) {
    return this.authService.loginByEmail(signInDto.email, signInDto.password);
  }

  @Post('signup')
  signUpByEmail(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUpByEmail(
      createUserDto.email,
      createUserDto.password,
    );
  }
}
