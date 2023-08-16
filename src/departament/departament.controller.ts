import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { DepartamentService } from './departament.service';
import { User } from 'src/auth/user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { createDepartamentDto, updateDepartamentDto } from './dto';
import { UserType } from 'types';

@Controller('api/departament')
@UseGuards(JwtAuthGuard)
export class DepartamentController {
  constructor(private departamentService: DepartamentService) {}

  @Get()
  getDepartaments(@User() user: UserType) {
    return this.departamentService.getDepartaments(user);
  }

  @Get(':id')
  getDepartament(@User() user: UserType, @Param('id') idParam: string) {
    return this.departamentService.getDepartament(user, idParam);
  }

  @Post('createDep')
  createDepartament(
    @Body() createDep: createDepartamentDto,
    @User() user: UserType,
  ) {
    return this.departamentService.createDepartament(createDep, user);
  }

  @Put('updateDep/:id')
  updateDepartament(
    @Body() updateDep: updateDepartamentDto,
    @User() user: UserType,
    @Param('id') id: string,
  ) {
    return this.departamentService.updateDepartament(updateDep, user, id);
  }

  @Delete('deleteDep/:id')
  deleteDepartament(@User() user: UserType, @Param('id') id: string) {
    return this.departamentService.deleteDepartament(user, id);
  }
}
