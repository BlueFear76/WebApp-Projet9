import { Module } from '@nestjs/common';
import { MissionsController } from './missions.controller';
import { MissionsService } from './missions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mission } from './entity/mission.entity';
import { GeocodingModule } from '../geocoding/geocoding.module';
import { Employee } from '../employee/entities/employee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Mission, Employee]), GeocodingModule],
  controllers: [MissionsController],
  providers: [MissionsService],
})
export class MissionsModule {}
