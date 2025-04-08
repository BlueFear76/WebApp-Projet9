import { Controller, Get } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('alerts')
@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  async findAll() {
    return this.alertsService.findAll();
  }
}
