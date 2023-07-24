import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { DepartamentModule } from './departament/departament.module';

@Module({
  imports: [AuthModule, PrismaModule, DepartamentModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
