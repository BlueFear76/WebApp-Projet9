import { ApiProperty } from '@nestjs/swagger';

export class CreateVehicleDto {
  @ApiProperty({
    example: 'Truck-001',
    description: 'Unique ID of the vehicle (example: Truck-001)',
  })
  vehicleId: string;
}
