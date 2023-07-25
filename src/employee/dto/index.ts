import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class createdEmployDto {
  @IsString()
  @IsNotEmpty()
  fullname: string;
  @IsString()
  @IsNotEmpty()
  lastname: string;
  @IsString()
  @IsNotEmpty()
  salary: string;
  @IsString()
  @IsNotEmpty()
  range: string;
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  departament: string;
}

export class updateEmployDto {
  @IsString()
  @IsNotEmpty()
  fullname: string;
  @IsString()
  @IsNotEmpty()
  lastname: string;
  @IsString()
  @IsNotEmpty()
  salary: string;
  @IsString()
  @IsNotEmpty()
  range: string;
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  departament: string;
}
