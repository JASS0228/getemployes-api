import { Module } from '@nestjs/common';
import { DepartamentService } from './departament.service';
import { DepartamentController } from './departament.controller';

@Module({
  providers: [DepartamentService],
  controllers: [DepartamentController]
})
export class DepartamentModule {}
