import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Mission } from './entity/mission.entity';
import { CreateMissionDto } from './dto/create-mission.dto';
import { GeocodingService } from '../geocoding/geocoding.service';
import { Employee } from '../employee/entities/employee.entity';
import { Vehicle } from '../vehicles/entity/vehicle.entity';

@Injectable()
export class MissionsService {
  constructor(
    @InjectRepository(Mission)
    private missionRepository: Repository<Mission>,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(Vehicle)
    private vehicleRepository: Repository<Vehicle>,
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
      vehicleId,
    } = createMissionDto;

    const { latitude, longitude } =
      await this.geocodingService.addressToCoordinates(address);

    const employees = await this.employeeRepository.find({
      where: { id: In(employeeIds) },
    });

    let vehicle: Vehicle | null = null;
    if (vehicleId) {
      vehicle = await this.vehicleRepository.findOne({
        where: { id: vehicleId },
      });
      if (!vehicle) {
        throw new NotFoundException(`Vehicle with ID ${vehicleId} not found`);
      }
    }

    const mission = this.missionRepository.create({
      name,
      description,
      address,
      latitude,
      longitude,
      startDate,
      endDate,
      employees,
      vehicle: vehicle || undefined, // Ensure vehicle is undefined if not found
    });

    return this.missionRepository.save(mission);
  }

  findAll() {
    return this.missionRepository.find({
      relations: ['employees', 'vehicle'], // 👈 Load the relation
    });
  }

  async findOne(id: number) {
    const mission = await this.missionRepository.findOne({
      where: { id },
      relations: ['employees', 'vehicle'], // 👈 Load the relation
    });
    if (!mission) {
      throw new NotFoundException(`Mission with ID ${id} not found`);
    }
    return mission;
  }

  async update(id: number, updateMissionDto: CreateMissionDto) {
    const mission = await this.findOne(id);

    const { address, name, description, startDate, endDate, vehicleId } =
      updateMissionDto;
    const { latitude, longitude } =
      await this.geocodingService.addressToCoordinates(address);

    let vehicle: Vehicle | null = null;
    if (vehicleId) {
      vehicle = await this.vehicleRepository.findOne({
        where: { id: vehicleId },
      });
      if (!vehicle) {
        throw new NotFoundException(`Vehicle with ID ${vehicleId} not found`);
      }
    }

    mission.name = name;
    mission.description = description;
    mission.address = address;
    mission.latitude = latitude;
    mission.longitude = longitude;
    mission.startDate = startDate;
    mission.endDate = endDate;
    if (vehicle) {
      mission.vehicle = vehicle; // Only assign if vehicle exists
    }

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

  async assignVehicle(id: number, vehicleId: number) {
    const mission = await this.findOne(id);
    const vehicle = await this.vehicleRepository.findOneBy({ id: vehicleId });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${vehicleId} not found`);
    }

    mission.vehicle = vehicle;
    return this.missionRepository.save(mission);
  }

  async remove(id: number) {
    const mission = await this.findOne(id);
    return this.missionRepository.remove(mission);
  }

  async getMissionByVehicleId(vehicleId: string): Promise<Mission> {
    const mission = await this.missionRepository.findOne({
      where: { vehicle: { id: Number(vehicleId) } },
      relations: ['vehicle'], // if vehicle is a relation
    });

    if (!mission) {
      throw new NotFoundException(
        `No mission found for vehicle ID ${vehicleId}`,
      );
    }

    return mission;
  }

  async assignTools(id: number, tags: string[]) {
    const mission = await this.missionRepository.findOneBy({ id });
    if (!mission) throw new NotFoundException('Mission not found');

    mission.assignedToolNames = tags;
    return this.missionRepository.save(mission);
  }
}
