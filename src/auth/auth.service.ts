import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}

  async Register(body: RegisterDto) {
    try {
      const { Fullname, email, lastname, password } = body;

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
}
