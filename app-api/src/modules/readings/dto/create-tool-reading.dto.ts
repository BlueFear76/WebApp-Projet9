import { ApiProperty } from '@nestjs/swagger';

export class CreateToolReadingDto {
  @ApiProperty({
    example: 'Truck-001',
    description: 'Vehicle ID that scanned the tools',
  })
  vehicleId: string;

  @ApiProperty({
    example: ['E2000017221101441890B31B', 'E2000017221101441890B31C'],
    description: 'List of RFID tag IDs detected during the scan',
  })
  toolTagIds: string[];

  @ApiProperty({
    example: 48.8566,
    description: 'Latitude from GPS',
  })
  latitude: number;

  @ApiProperty({
    example: 2.3522,
    description: 'Longitude from GPS',
  })
  longitude: number;

  @ApiProperty({
    example: 1,
    description: 'Optional mission ID if linked to a mission',
    required: false,
  })
  missionId?: number;
}
