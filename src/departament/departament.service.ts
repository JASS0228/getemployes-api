import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createDepartamentDto, updateDepartamentDto } from './dto';
import { UserType } from 'types';

@Injectable()
export class DepartamentService {
  constructor(private prismaService: PrismaService) {}

  async getDepartaments(user: UserType) {
    const userExists = await this.prismaService.user.findFirst({
      where: {
        email: user.email,
      },
      select: {
        id: true,
        Fullname: true,
        lastname: true,
        email: true,
      },
    });

    if (!userExists) {
      throw new BadRequestException('This user no exist');
    }

    const Departaments = await this.prismaService.departament.findMany({
      where: {
        userID: userExists.id,
      },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        _count: true,
      },
    });

    return Departaments;
  }

  async getDepartament(user: UserType, id: string) {
    try {
      const userExists = await this.prismaService.user.findFirst({
        where: {
          email: user.email,
        },
        select: {
          id: true,
          Fullname: true,
          lastname: true,
          email: true,
        },
      });

      if (!userExists) {
        throw new BadRequestException('This user no exist');
      }

      const departamentExist = await this.prismaService.departament.findFirst({
        where: {
          id,
          userID: userExists.id,
        },
        select: {
          id: true,
          name: true,
          description: true,
          createdAt: true,
          updatedAt: true,
          _count: true,
          employees: true,
          user: {
            select: {
              id: true,
              Fullname: true,
              lastname: true,
              email: true,
            },
          },
        },
      });

      if (!departamentExist) {
        throw new BadRequestException('Departament no exist');
      }

      return departamentExist;
    } catch (error) {
      throw error;
    }
  }

  async createDepartament(createDep: createDepartamentDto, user: UserType) {
    try {
      const { description, name } = createDep;

      const userExists = await this.prismaService.user.findFirst({
        where: {
          email: user.email,
        },
        select: {
          id: true,
          Fullname: true,
          lastname: true,
          email: true,
          departaments: true,
        },
      });

      if (!userExists) {
        throw new BadRequestException('This user no exist');
      }

      for (let i = 0; i < userExists.departaments.length; i++) {
        if (userExists.departaments[i].name === name) {
          throw new BadRequestException('This name is exist in your list');
        }
      }

      await this.prismaService.departament.create({
        data: {
          name,
          description,
          userID: userExists.id,
        },
      });

      return {
        msg: 'Departament created',
      };
    } catch (error) {
      throw error;
    }
  }

  //**TODO Make update Dep and Delete */
  async updateDepartament(updateDep: updateDepartamentDto, user: UserType) {}
}
