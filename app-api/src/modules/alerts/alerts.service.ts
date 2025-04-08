import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alert } from './entity/alert.entity';
import { SmsService } from '../sms/sms.service';

@Injectable()
export class AlertsService {
  constructor(
    @InjectRepository(Alert)
    private alertRepository: Repository<Alert>,
    private readonly smsService: SmsService, // Add this
  ) {}

  async create(
    toolTagId: string,
    vehicleId: string,
    message: string,
    missionId?: number,
    locationAddress?: string,
  ) {
    const alert = this.alertRepository.create({
      toolTagId,
      vehicleId,
      message,
      detectedAt: new Date(),
      locationAddress, // This should be set based on your requirements
      mission: missionId ? ({ id: missionId } as any) : undefined,
    });

    const savedAlert = await this.alertRepository.save(alert);

    // 🔥 Send SMS after saving the alert
    const recipientPhone = process.env.ALERT_PHONE_NUMBER;
    if (recipientPhone) {
      await this.smsService.sendSms(recipientPhone, message);
    }

    return savedAlert;
  }

  async findAll() {
    return this.alertRepository.find({
      relations: ['mission'], // Optional: Include mission details if needed
      order: { detectedAt: 'DESC' }, // Sort latest alerts first
    });
  }
}
