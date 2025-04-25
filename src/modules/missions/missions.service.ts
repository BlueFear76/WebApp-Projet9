import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Mission } from './entity/mission.entity';
import { CreateMissionDto } from './dto/create-mission.dto';
import { GeocodingService } from '../geocoding/geocoding.service';
import { Employee } from '../employee/entities/employee.entity';
import { Vehicle } from '../vehicles/entity/vehicle.entity';
import { UpdateMissionDto } from './dto/update-mission.dto';

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
      employeeIds,
      vehicleId,
      customerId,
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
      employeeIds,
      vehicle: vehicle || undefined, // Ensure vehicle is undefined if not found
      customerId,
    });

    return this.missionRepository.save(mission);
  }

  // 🚀 Get all missions with vehicle relation
  findAll() {
    return this.missionRepository.find({
      relations: ['vehicle'], // 👈 Load the relation
    });
  }

  // 🚀 Get a mission by ID with vehicle relation
  async findOne(id: number) {
    const mission = await this.missionRepository.findOne({
      where: { id },
      relations: ['vehicle'], // 👈 Load the relation
    });
    if (!mission) {
      throw new NotFoundException(`Mission with ID ${id} not found`);
    }
    return mission;
  }

  // async update(id: number, updateMissionDto: CreateMissionDto) {
  //   const mission = await this.findOne(id);

  //   const { address, name, description, startDate, endDate, vehicleId } =
  //     updateMissionDto;
  //   const { latitude, longitude } =
  //     await this.geocodingService.addressToCoordinates(address);

  //   let vehicle: Vehicle | null = null;
  //   if (vehicleId) {
  //     vehicle = await this.vehicleRepository.findOne({
  //       where: { id: vehicleId },
  //     });
  //     if (!vehicle) {
  //       throw new NotFoundException(`Vehicle with ID ${vehicleId} not found`);
  //     }
  //   }

  //   mission.name = name;
  //   mission.description = description;
  //   mission.address = address;
  //   mission.latitude = latitude;
  //   mission.longitude = longitude;
  //   mission.startDate = startDate;
  //   mission.endDate = endDate;
  //   if (vehicle) {
  //     mission.vehicle = vehicle; // Only assign if vehicle exists
  //   }

  //   return this.missionRepository.save(mission);
  // }

  // 🆕 Update mission with optional vehicle and employee IDs
  async update(id: number, updateMissionDto: UpdateMissionDto) {
    const mission = await this.findOne(id);

    const {
      address,
      name,
      description,
      startDate,
      endDate,
      vehicleId,
      employeeIds, // 🆕 récupère les employés assignés
    } = updateMissionDto;

    // Géocodage si l’adresse est fournie
    if (address) {
      const { latitude, longitude } =
        await this.geocodingService.addressToCoordinates(address);
      mission.address = address;
      mission.latitude = latitude;
      mission.longitude = longitude;
    }

    if (name !== undefined) mission.name = name;
    if (description !== undefined) mission.description = description;
    if (startDate !== undefined) mission.startDate = startDate;
    if (endDate !== undefined) mission.endDate = endDate;

    // 🚗 Vérifie que le véhicule existe si un ID est donné
    if (vehicleId !== undefined) {
      const vehicle = await this.vehicleRepository.findOne({
        where: { id: vehicleId },
      });

      if (!vehicle) {
        throw new NotFoundException(`Vehicle with ID ${vehicleId} not found`);
      }

      mission.vehicle = vehicle;
    }

    // 👥 Vérifie que tous les employés existent si employeeIds est fourni
    if (employeeIds !== undefined) {
      const employees = await this.employeeRepository.findBy({
        id: In(employeeIds),
      });

      if (employees.length !== employeeIds.length) {
        throw new NotFoundException('One or more employee IDs are invalid');
      }

      mission.employeeIds = employeeIds;
    }

    return this.missionRepository.save(mission);
  }

  // 🆕 Update employees assigned to a mission
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

  // 🆕 Assign a vehicle to a mission
  async assignVehicle(id: number, vehicleId: number) {
    const mission = await this.findOne(id);
    const vehicle = await this.vehicleRepository.findOneBy({ id: vehicleId });

    if (!vehicle) {
      throw new NotFoundException(`Vehicle with ID ${vehicleId} not found`);
    }

    mission.vehicle = vehicle;
    return this.missionRepository.save(mission);
  }

  // 🗑️ Delete a mission by ID
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

  // 🛠️ Assign tools to a mission
  async assignTools(id: number, tags: string[]) {
    const mission = await this.missionRepository.findOneBy({ id });
    if (!mission) throw new NotFoundException('Mission not found');

    mission.assignedToolNames = tags;
    return this.missionRepository.save(mission);
  }
}
