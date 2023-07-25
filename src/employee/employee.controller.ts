import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/auth/user.decorator';
import { UserType } from 'types';
import { createdEmployDto, updateEmployDto } from './dto';

@Controller('api/employee')
@UseGuards(JwtAuthGuard)
export class EmployeeController {
  constructor(private employeeService: EmployeeService) {}

  @Get()
  getEmployees(@User() user: UserType) {
    return this.employeeService.getEmployees(user);
  }

  @Get(':id')
  getEmployee(@User() user: UserType, @Param('id') id: string) {
    return this.employeeService.getEmployee(user, id);
  }

  @Post('createEmployee')
  createEmployee(@Body() createEmp: createdEmployDto, @User() user: UserType) {
    return this.employeeService.createEmployee(createEmp, user);
  }

  @Patch('updateEmployee/:id')
  updateEmployee(
    @Body() updateEmp: updateEmployDto,
    @User() user: UserType,
    @Param('id') id: string,
  ) {
    return this.employeeService.updateEmployee(updateEmp, user, id);
  }

  @Delete('deleteEmployee/:id')
  deleteEmployee(@User() user: UserType, @Param('id') id: string) {
    return this.employeeService.deleteEmployee(user, id);
  }
}
