import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ToolReading } from './entity/tool-reading.entity';
import { CreateToolReadingDto } from './dto/create-tool-reading.dto';
import { GeocodingService } from '../geocoding/geocoding.service';
import { Mission } from '../missions/entity/mission.entity';
import { AlertsService } from '../alerts/alerts.service';
import { ToolsService } from '../tools/tools.service';

@Injectable()
export class ReadingsService {
  constructor(
    @InjectRepository(ToolReading)
    private readingRepository: Repository<ToolReading>,
    private readonly geocodingService: GeocodingService,
    private readonly alertsService: AlertsService,
    private readonly toolsService: ToolsService,
  ) {}

  async create(createToolReadingDto: CreateToolReadingDto) {
    const { vehicleId, toolTagIds, latitude, longitude, missionId } =
      createToolReadingDto;

    // Get real address from GPS
    const { address } = await this.geocodingService.coordinatesToAddress(
      latitude,
      longitude,
    );

    // Create and save the new ToolReading
    const reading = this.readingRepository.create({
      vehicleId,
      toolTagIds,
      latitude,
      longitude,
      address,
      scannedAt: new Date(),
      mission: missionId ? ({ id: missionId } as Mission) : undefined,
    });

    const savedReading = await this.readingRepository.save(reading);

    // 🔥 If reading is linked to a mission, check for missing tools
    if (missionId) {
      const allReadings = await this.readingRepository.find({
        where: { mission: { id: missionId } },
        order: { scannedAt: 'ASC' },
      });

      // 🚨 This is the FIRST scan
      if (allReadings.length === 1) {
        // 🚨 First Scan
        const missionRepo =
          this.readingRepository.manager.getRepository(Mission);

        // Lookup tool names
        const toolNames: string[] = [];

        for (const rfidTagId of toolTagIds) {
          const tool = await this.toolsService.findByRfidTagId(rfidTagId);
          if (tool) {
            toolNames.push(tool.name);
          } else {
            toolNames.push(rfidTagId); // fallback if tool not found
          }
        }

        // Update the mission with real tool names
        await missionRepo.update(missionId, {
          assignedToolNames: toolNames,
        });
      }

      // 🚨 This is the second or more scan
      if (allReadings.length >= 2) {
        const firstScan = allReadings[0];
        const latestScan = allReadings[allReadings.length - 1];

        const missingToolTagIds = firstScan.toolTagIds.filter(
          (toolId) => !latestScan.toolTagIds.includes(toolId),
        );

        for (const missingToolTagId of missingToolTagIds) {
          const tool =
            await this.toolsService.findByRfidTagId(missingToolTagId);
          const toolName = tool ? tool.name : missingToolTagId; // fallback if tool not found

          await this.alertsService.create(
            missingToolTagId,
            vehicleId,
            `Tool "${toolName}" is missing after mission at ${address}.`,
            missionId,
          );
        }
      }
    }

    return savedReading;
  }

  findAll() {
    return this.readingRepository.find({
      relations: ['mission'],
    });
  }

  async remove(id: number) {
    const reading = await this.readingRepository.findOneBy({ id });

    if (!reading) {
      throw new NotFoundException(`Reading with ID ${id} not found`);
    }

    return this.readingRepository.delete(id);
  }
}
