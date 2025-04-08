import { Module } from '@nestjs/common';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './entities/employee.entity';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [TypeOrmModule.forFeature([Employee]), EmailModule], // Add your Employee entity here
  controllers: [EmployeeController],
  providers: [EmployeeService],
})
export class EmployeeModule {}
