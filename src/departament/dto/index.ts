import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class createDepartamentDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsOptional()
  description: string;
}

export class updateDepartamentDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsOptional()
  description: string;
}
