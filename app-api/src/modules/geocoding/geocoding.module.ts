import { Module } from '@nestjs/common';
import { GeocodingService } from './geocoding.service';

@Module({
  providers: [GeocodingService],
  exports: [GeocodingService], // Export the service to be used in other modules
})
export class GeocodingModule {}
