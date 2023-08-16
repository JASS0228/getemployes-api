import { BadRequestException, Injectable } from '@nestjs/common';
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

      const departamentExist = await this.prismaService.departament.findFirst({
        where: {
          name,
          user: {
            email: user.email,
          },
        },
      });

      if (departamentExist) {
        throw new BadRequestException('This departament is exist');
      }

      const departamentCreate = await this.prismaService.departament.create({
        data: {
          name,
          description,
          user: {
            connect: {
              email: user.email,
            },
          },
        },
      });

      return {
        message: 'Departament created',
        departamentCreate,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateDepartament(
    updateDep: updateDepartamentDto,
    user: UserType,
    id: string,
  ) {
    try {
      const departamentExist = await this.prismaService.departament.findFirst({
        where: {
          id,
          user: {
            email: user.email,
          },
        },
      });

      if (departamentExist?.name === updateDep.name) {
        throw new BadRequestException('This departament is exist');
      }

      if (!departamentExist) {
        throw new BadRequestException('This departament no exist');
      }

      const departamentUpdate = await this.prismaService.departament.update({
        where: {
          id,
          user: {
            email: user.email,
          },
        },
        data: {
          name: updateDep.name,
          description: updateDep.description,
          user: {
            connect: {
              email: user.email,
            },
          },
        },
      });

      return {
        message: 'Departament updated',
        departamentUpdate,
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteDepartament(user: UserType, id: string) {
    try {
      const userExists = await this.prismaService.user.findFirst({
        where: {
          email: user.email,
          AND: {
            departaments: {
              some: {
                id,
              },
            },
          },
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
        throw new BadRequestException('This departament no exist');
      }

      const departamentDelete = await this.prismaService.departament.delete({
        where: {
          id,
        },
      });

      return {
        message: 'Departament deleted',
        departamentDelete,
      };
    } catch (error) {
      throw error;
    }
  }
}
