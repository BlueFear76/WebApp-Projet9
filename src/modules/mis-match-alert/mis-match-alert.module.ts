import { Module } from '@nestjs/common';
import { MisMatchAlertController } from './mis-match-alert.controller';
import { MismatchAlertService } from './mis-match-alert.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MismatchAlert } from './entity/mismatch-alert.entity';

import { MissionsModule } from '../missions/missions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MismatchAlert]),
    MissionsModule, // Assuming MisMatchAlert is the entity for this module
  ],
  controllers: [MisMatchAlertController],
  providers: [MismatchAlertService],
})
export class MisMatchAlertModule {}
