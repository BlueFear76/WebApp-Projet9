import { ApiProperty } from '@nestjs/swagger';

export class AssignMissionDto {
  @ApiProperty({
    example: 'Truck-001',
    description: 'Vehicle ID to assign the mission to',
  })
  vehicleId: string;

  @ApiProperty({
    example: 1,
    description: 'Mission ID to assign',
  })
  missionId: number;
}
