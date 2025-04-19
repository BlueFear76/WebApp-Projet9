import { Module } from '@nestjs/common';
import { MissionsController } from './missions.controller';
import { MissionsService } from './missions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mission } from './entity/mission.entity';
import { GeocodingModule } from '../geocoding/geocoding.module';
import { Employee } from '../employee/entities/employee.entity';
import { Vehicle } from '../vehicles/entity/vehicle.entity';
import { CustomerModule } from '../customer/customer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Mission, Employee, Vehicle]),
    GeocodingModule,
    CustomerModule,
  ],
  controllers: [MissionsController],
  providers: [MissionsService],
})
export class MissionsModule {}
