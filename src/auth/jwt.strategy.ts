import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prismaService: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWTFromCookie,
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  static extractJWTFromCookie(req: Request): string {
    if (req.cookies?.token) {
      return req.cookies.token;
    }
    throw new UnauthorizedException('Invalid Authorization');
  }

  async validate(payload: { email: string; iat: number; exp: number }) {
    const userFound = await this.prismaService.user.findFirst({
      where: {
        email: payload.email,
      },
    });

    if (!userFound) {
      throw new UnauthorizedException('Invalid Authorization');
    }
    return { email: userFound.email };
  }
}
