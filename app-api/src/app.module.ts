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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Auto-create tables (good for dev)
      // logging: true, // Enable logging (good for dev)
    }),
    MissionsModule, // (Add more modules later)
    ReadingsModule,
    ToolsModule,
    VehiclesModule,

    AuthenticationModule,
    EmployeeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
