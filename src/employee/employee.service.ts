import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserType } from 'types';
import { createdEmployDto, updateEmployDto } from './dto';

@Injectable()
export class EmployeeService {
  constructor(private prismaService: PrismaService) {}

  async getEmployees(user: UserType) {
    try {
      const userExist = await this.prismaService.user.findFirst({
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

      const employees = await this.prismaService.employee.findMany({
        where: {
          userID: userExist.id,
        },
        select: {
          id: true,
          fullname: true,
          lastname: true,
          departament: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
      return employees;
    } catch (error) {
      throw error;
    }
  }

  async getEmployee(user: UserType, id: string) {
    try {
      const userExist = await this.prismaService.user.findFirst({
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

      const employee = await this.prismaService.employee.findFirst({
        where: {
          id,
          userID: userExist.id,
        },
        select: {
          id: true,
          fullname: true,
          lastname: true,
          salary: true,
          range: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              Fullname: true,
              lastname: true,
              email: true,
            },
          },
          departament: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
        },
      });

      if (!employee) {
        throw new BadRequestException('Employee no exist');
      }
      return employee;
    } catch (error) {
      throw error;
    }
  }

  async createEmployee(createEmp: createdEmployDto, user: UserType) {
    try {
      const userExists = await this.prismaService.user.findFirst({
        where: {
          email: user.email,
          departaments: {
            some: {
              id: createEmp.departament,
            },
          },
        },
        select: {
          id: true,
          Fullname: true,
          lastname: true,
          email: true,
          departaments: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!userExists) {
        throw new BadRequestException('Departament no exist');
      }

      await this.prismaService.employee.create({
        data: {
          fullname: createEmp.fullname,
          lastname: createEmp.lastname,
          salary: createEmp.salary,
          range: createEmp.range,
          userID: userExists.id,
          departamentID: createEmp.departament,
        },
      });

      return { msg: 'Employee created' };
    } catch (error) {
      throw error;
    }
  }

  async updateEmployee(updateEmp: updateEmployDto, user: UserType, id: string) {
    try {
      const userExist = await this.prismaService.user.findFirst({
        where: {
          email: user.email,
          employees: {
            some: {
              id,
            },
          },
          departaments: {
            some: {
              id: updateEmp.departament,
            },
          },
        },
        select: {
          id: true,
          email: true,
          Fullname: true,
          lastname: true,
          departaments: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!userExist) {
        throw new BadRequestException('Not Found');
      }

      const updateEmploy = await this.prismaService.employee.update({
        where: {
          id,
          userID: userExist.id,
        },
        data: {
          fullname: updateEmp.fullname,
          lastname: updateEmp.lastname,
          departamentID: updateEmp.departament,
          salary: updateEmp.salary,
          range: updateEmp.range,
          userID: userExist.id,
        },
      });

      return updateEmploy;
    } catch (error) {
      throw error;
    }
  }

  async deleteEmployee(user: UserType, id: string) {
    const userExist = await this.prismaService.user.findFirst({
      where: {
        email: user.email,
        employees: {
          some: {
            id,
          },
        },
      },
      select: {
        id: true,
        email: true,
        Fullname: true,
        lastname: true,
        departaments: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!userExist) {
      throw new BadRequestException('Not Found');
    }

    const deleteEmp = await this.prismaService.employee.delete({
      where: {
        id,
      },
    });

    return deleteEmp;
  }
}
