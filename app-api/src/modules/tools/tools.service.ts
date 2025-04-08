import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tool } from './entity/tool.entity';
import { CreateToolDto } from './dto/create-tool.dto';

@Injectable()
export class ToolsService {
  constructor(
    @InjectRepository(Tool)
    private toolRepository: Repository<Tool>,
  ) {}

  create(createToolDto: CreateToolDto) {
    const tool = this.toolRepository.create(createToolDto);
    return this.toolRepository.save(tool);
  }

  findAll() {
    return this.toolRepository.find();
  }

  findOne(id: number) {
    return this.toolRepository.findOneBy({ id });
  }

  findByRfidTagId(rfidTagId: string) {
    return this.toolRepository.findOneBy({ rfidTagId });
  }

  updateLocation(id: number, location: string) {
    return this.toolRepository.update(id, { lastKnownLocation: location });
  }

  updateStatus(id: number, status: string) {
    return this.toolRepository.update(id, { status });
  }

  async assignRfidTag(id: number, rfidTagId: string) {
    // Check if another tool already has this RFID
    const existingTool = await this.toolRepository.findOneBy({ rfidTagId });

    if (existingTool && existingTool.id !== id) {
      throw new BadRequestException(
        `RFID tag "${rfidTagId}" is already assigned to another tool.`,
      );
    }

    // If RFID is free, update the tool
    return this.toolRepository.update(id, { rfidTagId });
  }
}
