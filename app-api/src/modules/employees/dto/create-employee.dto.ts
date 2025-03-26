import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateEmployeeDto {
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
  @MinLength(6)
  password: string;
}
