import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt } from 'class-validator';

export class UpdateMissionEmployeesDto {
  @ApiProperty({ example: [1, 2, 3], description: 'List of employee IDs' })
  @IsArray()
  @IsInt({ each: true })
  employeeIds: number[];
}
