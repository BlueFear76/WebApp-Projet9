import { PartialType } from '@nestjs/swagger';
import { CreateEmployeeDto } from './create-employee.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { EmployeeRole } from '../entities/employee.entity';

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {
  @IsOptional()
  @IsEnum(EmployeeRole, {
    message: `Role must be one of the following values: ${Object.values(EmployeeRole).join(', ')}`,
  })
  role?: EmployeeRole;
}
