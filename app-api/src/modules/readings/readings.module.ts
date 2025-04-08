import { Module } from '@nestjs/common';
import { ReadingsController } from './readings.controller';
import { ReadingsService } from './readings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ToolReading } from './entity/tool-reading.entity';
import { MissionsModule } from '../missions/missions.module';
import { GeocodingModule } from '../geocoding/geocoding.module';
import { AlertsModule } from '../alerts/alerts.module';
import { ToolsModule } from '../tools/tools.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ToolReading]),
    MissionsModule,
    GeocodingModule,
    AlertsModule,
    ToolsModule,
  ],
  controllers: [ReadingsController],
  providers: [ReadingsService],
})
export class ReadingsModule {}
