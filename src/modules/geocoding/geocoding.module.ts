import { Module } from '@nestjs/common';
import { GeocodingService } from './geocoding.service';
import { GeocodingController } from './geocoding.controller';

@Module({
  providers: [GeocodingService],
  exports: [GeocodingService], // Export the service to be used in other modules
  controllers: [GeocodingController]
})
export class GeocodingModule {}
