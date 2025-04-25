// src/customer/customer.module.ts

import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { Mission } from '../missions/entity/mission.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, Mission])],
  controllers: [CustomerController],
  providers: [CustomerService],
  exports: [TypeOrmModule],
})
export class CustomerModule {}
