import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional } from 'class-validator';

export class CreateMissionDto {
  @ApiProperty({
    example: 'Garden Maintenance',
    description: 'Name of the mission',
  })
  name: string;

  @ApiProperty({
    example: 'Clean up garden and mow the lawn',
    description: 'Detailed description of the mission',
  })
  description: string;

  @ApiProperty({
    example: 'Green Park, Paris',
    description: 'Address where the mission will take place',
  })
  address: string;

  @ApiProperty({
    example: '2025-04-10T09:00:00.000Z',
    description: 'Start date and time of the mission (ISO format)',
    type: String,
    format: 'date-time',
  })
  startDate: Date;

  @ApiProperty({
    example: '2025-04-10T17:00:00.000Z',
    description: 'End date and time of the mission (ISO format)',
    type: String,
    format: 'date-time',
  })
  endDate: Date;

  @ApiProperty({
    example: [1, 2],
    description: 'Assigned employees to a mission',
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  employeeIds: number[]; // Array of employee IDs to be assigned to the mission
}
