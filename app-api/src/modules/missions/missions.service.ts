import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mission } from './entity/mission.entity';
import { CreateMissionDto } from './dto/create-mission.dto';
import { GeocodingService } from '../geocoding/geocoding.service';

@Injectable()
export class MissionsService {
  constructor(
    @InjectRepository(Mission)
    private missionRepository: Repository<Mission>,
    private readonly geocodingService: GeocodingService,
  ) {}

  async create(createMissionDto: CreateMissionDto) {
    const { address, name, description, startDate, endDate } = createMissionDto;
    const { latitude, longitude } =
      await this.geocodingService.addressToCoordinates(address);

    const mission = this.missionRepository.create({
      name,
      description,
      address,
      latitude,
      longitude,
      startDate,
      endDate,
    });

    return this.missionRepository.save(mission);
  }

  findAll() {
    return this.missionRepository.find();
  }

  async findOne(id: number) {
    const mission = await this.missionRepository.findOneBy({ id });
    if (!mission) {
      throw new NotFoundException(`Mission with ID ${id} not found`);
    }
    return mission;
  }

  async update(id: number, updateMissionDto: CreateMissionDto) {
    const mission = await this.findOne(id);

    const { address, name, description, startDate, endDate } = updateMissionDto;
    const { latitude, longitude } =
      await this.geocodingService.addressToCoordinates(address);

    mission.name = name;
    mission.description = description;
    mission.address = address;
    mission.latitude = latitude;
    mission.longitude = longitude;
    mission.startDate = startDate;
    mission.endDate = endDate;

    return this.missionRepository.save(mission);
  }

  async remove(id: number) {
    const mission = await this.findOne(id);
    return this.missionRepository.remove(mission);
  }
}
