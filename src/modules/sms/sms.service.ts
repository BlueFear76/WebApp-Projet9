import { Injectable } from '@nestjs/common';
import * as Twilio from 'twilio';
import { config } from 'dotenv';
config(); // Load environment variables from .env file

@Injectable()
export class SmsService {
  private client: Twilio.Twilio;
  private fromPhoneNumber: string;

  constructor() {
    this.client = Twilio(
      process.env.TWILIO_ACCOUNT_SID! ,
      process.env.TWILIO_AUTH_TOKEN!,
    );

    const fromPhone = process.env.TWILIO_PHONE_NUMBER || "+19282185543";
    if (!fromPhone) {
      throw new Error('TWILIO_PHONE_NUMBER is not set in .env file');
    }
    this.fromPhoneNumber = fromPhone;
  }

  async sendSms(to: string, message: string) {
    return this.client.messages.create({
      body: message,
      from: this.fromPhoneNumber,
      to,
    });
  }
}
