import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
import { Response } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';
import { User } from './user.decorator';
import { UserType } from 'types';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  Register(@Body() registerBody: RegisterDto) {
    return this.authService.Register(registerBody);
  }

  @Post('login')
  Login(
    @Body() loginBody: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.Login(loginBody, response);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  Profile(@User() user: UserType) {
    return this.authService.Profile(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  LogOut(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('token');
    return {
      msg: 'Logout Success',
    };
  }
}
