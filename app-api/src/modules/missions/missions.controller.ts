import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { MissionsService } from './missions.service';
import { CreateMissionDto } from './dto/create-mission.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { RolesGuard } from '../authentication/guards/roles.guard';
import { Roles } from '../authentication/decorator/roles.decorator';

@ApiTags('missions')
@Controller('missions')
export class MissionsController {
  constructor(private readonly missionsService: MissionsService) {}

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

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a mission by ID' })
  @ApiParam({ name: 'id', required: true })
  @ApiResponse({ status: 200, description: 'Mission deleted.' })
  remove(@Param('id') id: string) {
    return this.missionsService.remove(+id);
  }
}
