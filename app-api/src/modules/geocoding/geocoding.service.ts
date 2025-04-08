import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class GeocodingService {
  private nominatimUrl = 'https://nominatim.openstreetmap.org';

  async addressToCoordinates(address: string) {
    const response = await axios.get(`${this.nominatimUrl}/search`, {
      params: {
        q: address,
        format: 'json',
        limit: 1,
      },
    });

    const data = response.data as any[]; // <-- Add this cast!

    if (!data || data.length === 0) {
      throw new Error('Address not found');
    }

    return {
      latitude: parseFloat(data[0].lat),
      longitude: parseFloat(data[0].lon),
    };
  }

  async coordinatesToAddress(lat: number, lon: number) {
    const response = await axios.get(`${this.nominatimUrl}/reverse`, {
      params: {
        lat,
        lon,
        format: 'json',
      },
    });

    const data = response.data as { display_name: string }; // <-- Add type here!

    if (!data || !data.display_name) {
      throw new Error('Location not found');
    }

    return {
      address: data.display_name,
    };
  }
}
