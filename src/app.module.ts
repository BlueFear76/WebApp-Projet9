import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MissionsModule } from './modules/missions/missions.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReadingsModule } from './modules/readings/readings.module';

import { ToolsModule } from './modules/tools/tools.module';
import { VehiclesModule } from './modules/vehicles/vehicles.module';
// import { UsersModule } from './modules/users/users.module';
// import { AuthModule } from './modules/auth/auth.module';
// import { APP_GUARD } from '@nestjs/core';
// import { JwtAuthGuard } from './modules/auth/jwt-auth.guard';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { EmployeeModule } from './modules/employee/employee.module';

import { GeocodingModule } from './modules/geocoding/geocoding.module';
import { Mission } from './modules/missions/entity/mission.entity';
import { Employee } from './modules/employee/entities/employee.entity';
import { Vehicle } from './modules/vehicles/entity/vehicle.entity';
import { Tool } from './modules/tools/entity/tool.entity';
import { Alert } from './modules/alerts/entity/alert.entity';
import { ToolReading } from './modules/readings/entity/tool-reading.entity';
import { config } from 'dotenv';
config(); // Load environment variables from .env file

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql', // Use MySQL
      host:  'interchange.proxy.rlwy.net', // Change this to your MySQL host
      port: 50851, // Default MySQL port
      username:  'root', // Use environment variable for username
      password: 'iHsxMlGHUmCJFtRyZhWRZRIrxBePCGnX', // Use environment variable for password
      database: 'railway', // Change this to your database name
      entities: [Mission, Employee, Vehicle, Tool, Alert, ToolReading],
      synchronize: true, // Be cautious with this in production (it syncs the DB structure automatically)
      autoLoadEntities: true,
    }),
    MissionsModule, // (Add more modules later)
    ReadingsModule,
    ToolsModule,
    VehiclesModule,
    GeocodingModule,
    AuthenticationModule,
    EmployeeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
