import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional } from 'class-validator';

export class UpdateMissionDto {
  @ApiProperty({
    example: 'Garden Maintenance',
    description: 'Name of the mission',
  })
  @IsOptional()
  name: string;

  @ApiProperty({
    example: 'Clean up garden and mow the lawn',
    description: 'Detailed description of the mission',
  })
  @IsOptional()
  description: string;

  @ApiProperty({
    example: 'Green Park, Paris',
    description: 'Address where the mission will take place',
  })
  @IsOptional()
  address: string;

  @ApiProperty({
    example: '2025-04-10T09:00:00.000Z',
    description: 'Start date and time of the mission (ISO format)',
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  startDate: Date;

  @ApiProperty({
    example: '2025-04-10T17:00:00.000Z',
    description: 'End date and time of the mission (ISO format)',
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  endDate: Date;

  @ApiProperty({
    example: 1,
    description: 'ID of the customer associated with the mission',
  })
  @IsNumber()
  @IsOptional()
  customerId: number;

  @ApiProperty({
    example: [1, 2],
    description: 'Assigned employees to a mission',
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  employeeIds: number[]; // Array of employee IDs to be assigned to the mission

  @IsOptional()
  @IsNumber()
  vehicleId?: number; // Optional field for mission assignment
}
