import { SmsService } from './../sms/sms.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alert } from './entity/alert.entity';

@Injectable()
export class AlertsService {
  constructor(
    @InjectRepository(Alert)
    private alertRepository: Repository<Alert>,
    private readonly smsService: SmsService,
  ) {}

  // Method to create an alert
  async create(toolTagIds: string[], missionId: number) {
    const alert = this.alertRepository.create({
      toolTagId: toolTagIds, // Tool tags will be an array of strings
      mission: { id: missionId }, // Mission is referenced by its ID
    });

    const savedAlert = await this.alertRepository.save(alert);

    // 🔥 Send SMS after saving the alert
    const recipientPhone = process.env.ALERT_PHONE_NUMBER;
    if (recipientPhone) {
      const message = `Tool(s) with ID(s) ${toolTagIds.join(', ')} are missing after mission with ID ${missionId}`;
      await this.smsService.sendSms(recipientPhone, message);
    }

    return savedAlert;
  }

  // Method to get all alerts
  async findAll() {
    return this.alertRepository.find({
      relations: ['mission'], // Optionally, include mission details
      order: { id: 'DESC' }, // Sort alerts by ID
    });
  }

  async findOne(id: number) {
    const alert = await this.alertRepository.findOne({
      where: { id },
      relations: ['mission'],
    });
    if (!alert) {
      throw new NotFoundException(`Alert with ID ${id} not found`);
    }
    return alert;
  }

  async update(id: number, updateData: Partial<Alert>) {
    const alert = await this.alertRepository.preload({
      id,
      ...updateData,
    });
    if (!alert) {
      throw new NotFoundException(`Alert with ID ${id} not found`);
    }
    return this.alertRepository.save(alert);
  }

  async remove(id: number) {
    const alert = await this.findOne(id);
    return this.alertRepository.remove(alert);
  }
}
