import { IsNumber } from 'class-validator';

export class AssignVehicleDto {
  @IsNumber()
  vehicleId: number; // ID of the vehicle to assign
}
