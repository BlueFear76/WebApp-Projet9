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

import { ConfigModule, ConfigService } from '@nestjs/config';
// Load environment variables from .env file

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // Specify the path to your .env file
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT', 50851), // default value
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [Mission, Employee, Vehicle, Tool, Alert, ToolReading],
        synchronize: configService.get('DB_SYNCHRONIZE', false), // safer default
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
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
