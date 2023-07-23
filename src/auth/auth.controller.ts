import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
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
  Register(@Body() body: RegisterDto) {
    return this.authService.Register(body);
  }

  @Post('login')
  Login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.Login(body, response);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  Profile(@User() user) {
    return this.authService.Profile(user);
  }
}
