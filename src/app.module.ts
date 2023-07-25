import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { DepartamentModule } from './departament/departament.module';
import { EmployeeModule } from './employee/employee.module';

@Module({
  imports: [AuthModule, PrismaModule, DepartamentModule, EmployeeModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
