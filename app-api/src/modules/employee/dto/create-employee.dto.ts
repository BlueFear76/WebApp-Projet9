// src/employee/dto/create-employee.dto.ts

import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEmployeeDto {
  @ApiProperty({ description: 'First name of the employee', example: 'John' })
  @IsNotEmpty()
  firstname: string;

  @ApiProperty({ description: 'Last name of the employee', example: 'Doe' })
  @IsNotEmpty()
  lastname: string;

  @ApiProperty({
    description: 'Email of the employee',
    example: 'gowusu018@gmail.com',
  })
  @IsEmail()
  email: string;
}
