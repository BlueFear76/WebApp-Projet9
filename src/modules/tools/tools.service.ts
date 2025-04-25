import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
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

  updateAssignationDate(id: number, updateAssignationDate: string) {
    return this.toolRepository.update(id, { assignationDate: updateAssignationDate });
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

  async updateAll(id: number, name: string, rfidTagId: string, status: string, lastKnownLocation: string){
    const updatedData = {
      name,
      rfidTagId,
      status,
      lastKnownLocation,
      assignationDate: 'inconnue',
      note: ''
    };
    return this.toolRepository.update(id, updatedData);
  }

  async remove(id: number): Promise<void> {
    const result = await this.toolRepository.delete(id);
    if (result.affected === 0) {
      throw new BadRequestException(`Tool with ID ${id} not found.`);
    }
  }
}
