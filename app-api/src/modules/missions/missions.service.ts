import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Mission } from './entity/mission.entity';
import { CreateMissionDto } from './dto/create-mission.dto';
import { UpdateMissionDto } from './dto/update-mission.dto';
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
      customerId,
      employeeIds,
      vehicleId,
    } = createMissionDto;

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

    const mission = this.missionRepository.create({
      name,
      description,
      address,
      latitude,
      longitude,
      startDate,
      endDate,
      vehicle: vehicle || undefined, // Ensure vehicle is undefined if not found
      customerId,
      employeeIds,
    });

    return this.missionRepository.save(mission);
  }

  findAll() {
    return this.missionRepository.find({
      relations: ['vehicle'], // 👈 Load the relation
    });
  }

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
      const employees = await this.employeeRepository.findBy({ id: In(employeeIds) });
  
      if (employees.length !== employeeIds.length) {
        throw new NotFoundException('One or more employee IDs are invalid');
      }
  
      mission.employeeIds = employeeIds;
    }
  
    return this.missionRepository.save(mission);
  }

  async updateEmployees(id: number, employeeIds: number[]): Promise<Mission> {
    const mission = await this.missionRepository.findOne({ where: { id } });
  
    if (!mission) {
      throw new NotFoundException(`Mission with ID ${id} not found`);
    }
  
    // Vérifie si les employés existent vraiment
    const employees = await this.employeeRepository.findBy({
      id: In(employeeIds),
    });
  
    if (employees.length !== employeeIds.length) {
      throw new NotFoundException(`One or more employees not found`);
    }
  
    // Mets à jour la liste des IDs
    mission.employeeIds = employeeIds;
  
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
}
