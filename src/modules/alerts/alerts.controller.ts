import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Patch,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('alerts')
@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  // Create alert endpoint
  // @Post()
  // async create(
  //   @Body('toolTagId') toolTagId: string[], // Accept toolTagId
  //   @Body('missionId') missionId: number, // Accept missionId
  // ) {
  //   await this.alertsService.create(toolTagId, missionId); // Create alert with provided details
  // }

  @Post()
  async createAlert(@Body() body: { toolTagIds: string[]; missionId: number }) {
    return this.alertsService.create(body.toolTagIds, body.missionId);
  }

  @Get()
  findAll() {
    return this.alertsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.alertsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: Partial<{ toolTagId: string[]; missionId: number }>,
  ) {
    return this.alertsService.update(id, updateData);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.alertsService.remove(id);
  }
}
