// src/email/email.controller.ts

import { Controller, Post, Body } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('test')
  async sendTestEmail(
    @Body() body: { name: string; email: string; password: string },
  ) {
    await this.emailService.sendEmployeeCredentials(
      body.name,
      body.email,
      body.password,
    );
    return { message: 'Email envoyé (si tout va bien 🎯)' };
  }
}