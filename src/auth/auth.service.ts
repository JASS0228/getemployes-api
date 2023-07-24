import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { UserType } from 'types';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async Register(registerBody: RegisterDto) {
    try {
      const { Fullname, email, lastname, password } = registerBody;

      const IsUserExist = await this.prismaService.user.findFirst({
        where: { email },
      });

      if (IsUserExist) {
        throw new ConflictException('User already exist');
      }

      const passwordHash = await bcrypt.hash(password, 10);

      await this.prismaService.user.create({
        data: {
          email,
          Fullname,
          lastname,
          password: passwordHash,
        },
      });

      return {
        msg: 'User created',
      };
    } catch (error) {
      throw error;
    }
  }

  async Login(loginBody: LoginDto, response: Response) {
    try {
      const { email, password } = loginBody;

      const IsUserExist = await this.prismaService.user.findFirst({
        where: { email },
      });

      if (!IsUserExist) {
        throw new ConflictException('User not found');
      }

      if (!(await bcrypt.compare(password, IsUserExist.password))) {
        throw new NotFoundException('Invalid Credentials');
      }

      const payload = { email: IsUserExist.email };

      const token = this.jwtService.sign(payload);

      response.cookie('token', token, {
        expires: new Date(Date.now() + 1000 * 3600 * 24 * 7),
      });

      return {
        msg: 'Ok',
      };
    } catch (error) {
      throw error;
    }
  }

  async Profile(user: UserType) {
    try {
      const UserFound = await this.prismaService.user.findFirst({
        where: {
          email: user.email,
        },
        select: {
          id: true,
          email: true,
          Fullname: true,
          lastname: true,
          departaments: true,
          employees: true,
        },
      });
      return UserFound;
    } catch (error) {
      throw error;
    }
  }
}
