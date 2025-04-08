import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from './entity/vehicle.entity';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,
  ) {}

  create(vehicleId: string) {
    const vehicle = this.vehicleRepository.create({ vehicleId });
    return this.vehicleRepository.save(vehicle);
  }

  findAll() {
    return this.vehicleRepository.find();
  }

  assignMission(vehicleId: string, missionId: number) {
    return this.vehicleRepository
      .createQueryBuilder()
      .update(Vehicle)
      .set({ activeMission: { id: missionId } as any })
      .where('vehicleId = :vehicleId', { vehicleId })
      .execute();
  }

  async findActiveMission(vehicleId: string) {
    const vehicle = await this.vehicleRepository.findOne({
      where: { vehicleId },
      relations: ['activeMission'],
    });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${vehicleId} not found`);
    }

    return vehicle;
  }
}
