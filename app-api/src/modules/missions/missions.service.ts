import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Mission } from './entity/mission.entity';
import { CreateMissionDto } from './dto/create-mission.dto';
import { GeocodingService } from '../geocoding/geocoding.service';
import { Employee } from '../employee/entities/employee.entity';

@Injectable()
export class MissionsService {
  constructor(
    @InjectRepository(Mission)
    private missionRepository: Repository<Mission>,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    private readonly geocodingService: GeocodingService,
  ) {}

  async create(createMissionDto: CreateMissionDto) {
    const {
      address,
      name,
      description,
      startDate,
      endDate,
      employeeIds = [],
    } = createMissionDto;

    const { latitude, longitude } =
      await this.geocodingService.addressToCoordinates(address);

    const employees = await this.employeeRepository.find({
      where: { id: In(employeeIds) },
    });

    const mission = this.missionRepository.create({
      name,
      description,
      address,
      latitude,
      longitude,
      startDate,
      endDate,
      employees,
    });

    return this.missionRepository.save(mission);
  }

  findAll() {
    return this.missionRepository.find({
      relations: ['employees'],
    });
  }

  async findOne(id: number) {
    const mission = await this.missionRepository.findOne({
      where: { id },
      relations: ['employees'], // 👈 Load the relation
    });
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

  async updateEmployees(id: number, employeeIds: number[]): Promise<Mission> {
    const mission = await this.missionRepository.findOne({
      where: { id },
      relations: ['employees'],
    });

    if (!mission) {
      throw new NotFoundException(`Mission with ID ${id} not found`);
    }

    const employees = await this.employeeRepository.findBy({
      id: In(employeeIds),
    });

    mission.employees = employees;
    return this.missionRepository.save(mission);
  }
  async remove(id: number) {
    const mission = await this.findOne(id);
    return this.missionRepository.remove(mission);
  }
}
