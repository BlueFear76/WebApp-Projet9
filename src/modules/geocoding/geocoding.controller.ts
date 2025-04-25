import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { GeocodingService } from './geocoding.service';

@Controller('geocoding')
export class GeocodingController {
  constructor(private readonly geocodingService: GeocodingService) {}

  @Post('address')
  async addressToCoordinates(@Body() body: { address: string }) {
    const { address } = body;
    try {
      return await this.geocodingService.addressToCoordinates(address);
    } catch (error) {
      return { error: error.message };
    }
  }

  @Get()
  async getResponse() {
    return 'uwu';
  }

  @Get('reverse')
  async coordinatesToAddress(
    @Query('lat') lat: number,
    @Query('lon') lon: number,
  ) {
    try {
      return await this.geocodingService.coordinatesToAddress(lat, lon);
    } catch (error) {
      return { error: error.message };
    }
  }
}