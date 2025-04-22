import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { MissionsService } from './missions.service';
import { CreateMissionDto } from './dto/create-mission.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { RolesGuard } from '../authentication/guards/roles.guard';
import { Roles } from '../authentication/decorator/roles.decorator';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from '../employee/entities/employee.entity';
import { UpdateMissionEmployeesDto } from './dto/update-mission-employees.dto';
import { AssignVehicleDto } from '../vehicles/dto/assign-vehicle.dto';
import { Mission } from './entity/mission.entity';

@ApiTags('missions')
@Controller('missions')
export class MissionsController {
  constructor(
    private readonly missionsService: MissionsService,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new mission' })
  @ApiResponse({
    status: 201,
    description: 'The mission has been successfully created.',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin') // Only Admin can create missions
  create(@Body() createMissionDto: CreateMissionDto) {
    return this.missionsService.create(createMissionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all missions' })
  @ApiResponse({ status: 200, description: 'List of all missions.' })
  findAll() {
    return this.missionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a mission by ID' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'Mission found.' })
  findOne(@Param('id') id: string) {
    return this.missionsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a mission by ID' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'Mission updated.' })
  update(@Param('id') id: string, @Body() updateMissionDto: CreateMissionDto) {
    return this.missionsService.update(+id, updateMissionDto);
  }

  @Patch(':id/assign-vehicle')
  @ApiParam({
    name: 'id',
    description: 'The ID of the mission to assign a vehicle to',
    type: Number,
  })
  async assignVehicle(
    @Param('id') missionId: number,
    @Body() assignVehicleDto: AssignVehicleDto,
  ) {
    return this.missionsService.assignVehicle(
      missionId,
      assignVehicleDto.vehicleId,
    );
  }

  @Patch(':id/employees')
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @HttpCode(200)
  @ApiOperation({ summary: 'Update employees assigned to a mission' })
  async updateEmployees(
    @Param('id') id: string,
    @Body() updateDto: UpdateMissionEmployeesDto,
  ) {
    return this.missionsService.updateEmployees(+id, updateDto.employeeIds);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a mission by ID' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'Mission deleted.' })
  remove(@Param('id') id: string) {
    return this.missionsService.remove(+id);
  }

  @Get('vehicle/:vehicleId')
  async getMissionByVehicleId(
    @Param('vehicleId') vehicleId: string,
  ): Promise<Mission> {
    return this.missionsService.getMissionByVehicleId(vehicleId);
  }

  @Patch(':id/assign-tools')
  async assignToolsToMission(
    @Param('id') id: number,
    @Body('tags') tags: string[],
  ) {
    return this.missionsService.assignTools(+id, tags);
  }
}
// e280699500005014cc146862
