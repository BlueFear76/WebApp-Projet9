import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';

@Module({
  providers: [SmsService],
  exports: [SmsService], // Export the service to be used in other modules
})
export class SmsModule {}
