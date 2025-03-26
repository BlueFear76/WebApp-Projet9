import { Employee } from './../employees.entity';
import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EmployeeLoginDto {
  @ApiProperty({
    description: 'The username of the employee',
    example: 'JohnDoe',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'The password of the employee',
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
