// import { Injectable } from '@nestjs/common';
// import * as Twilio from 'twilio';
// import { ConfigService } from '@nestjs/config';
// // Load environment variables from .env file

// @Injectable()
// export class SmsService {
//   private client: Twilio.Twilio;
//   private fromPhoneNumber: string;

//   constructor() {
//     this.client = Twilio(
//       process.env.TWILIO_ACCOUNT_SID!,
//       process.env.TWILIO_AUTH_TOKEN!,
//     );

//     const fromPhone = process.env.TWILIO_PHONE_NUMBER || '+19282185543';
//     if (!fromPhone) {
//       throw new Error('TWILIO_PHONE_NUMBER is not set in .env file');
//     }
//     this.fromPhoneNumber = fromPhone;
//   }

//   async sendSms(to: string, message: string) {
//     return this.client.messages.create({
//       body: message,
//       from: this.fromPhoneNumber,
//       to,
//     });
//   }
// }

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Twilio from 'twilio';

@Injectable()
export class SmsService {
  private client: Twilio.Twilio;
  private fromPhoneNumber: string;

  constructor(private configService: ConfigService) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');

    if (!accountSid || !authToken) {
      throw new Error('Missing Twilio credentials in environment variables');
    }

    this.client = Twilio(accountSid, authToken);

    this.fromPhoneNumber = this.configService.get<string>(
      'TWILIO_PHONE_NUMBER',
    )!;

    if (!this.fromPhoneNumber) {
      throw new Error('TWILIO_PHONE_NUMBER is not set in .env file');
    }
  }

  async sendSms(to: string, message: string) {
    return this.client.messages.create({
      body: message,
      from: this.fromPhoneNumber,
      to,
    });
  }
}
