import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { AssignMissionDto } from './dto/assign-mission.dto';

@ApiTags('vehicles')
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  create(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehiclesService.create(createVehicleDto.vehicleId);
  }

  @Post('assign-mission')
  assignMission(@Body() assignMissionDto: AssignMissionDto) {
    return this.vehiclesService.assignMission(
      assignMissionDto.vehicleId,
      assignMissionDto.missionId,
    );
  }

  @Get(':vehicleId/active-mission')
  @ApiParam({
    name: 'vehicleId',
    description: 'The ID of the vehicle (example: Truck-001)',
    type: String,
  })
  findActiveMission(@Param('vehicleId') vehicleId: string) {
    return this.vehiclesService.findActiveMission(vehicleId);
  }
}
