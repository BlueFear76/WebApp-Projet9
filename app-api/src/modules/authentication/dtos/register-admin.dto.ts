// src/authentication/dtos/register-admin.dto.ts

import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterAdminDto {
  @ApiProperty({ example: 'John', description: 'First name of the admin' })
  @IsNotEmpty()
  firstname: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the admin' })
  @IsNotEmpty()
  lastname: string;

  @ApiProperty({
    example: 'new@example.com',
    description: 'Email of the admin',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'StrongPassword123',
    description: 'Password for the admin',
    minLength: 6,
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
