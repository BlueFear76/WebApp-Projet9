// src/email/email.service.ts

import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { config } from 'dotenv';
import { employeeCredentialsEmail } from './email-templates/employee-credentials.template';
import { first } from 'rxjs';

config(); // Load environment variables

@Injectable()
export class EmailService {
  private readonly transporter: nodemailer.Transporter;
  private readonly logger = new Logger(EmailService.name); // 👈 NestJS Logger

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendEmployeeCredentials(
    name: string,
    to: string,
    password: string,
  ): Promise<void> {
    const resetLink = `${process.env.FRONTEND_RESET_PASSWORD_URL}?email=${encodeURIComponent(to)}`;

    const mailOptions = {
      from: `"Tool Tracking System" <${process.env.EMAIL_USER}>`,
      to,
      subject: 'Your Tool Tracking System Account Details',
      html: employeeCredentialsEmail(name, to, password, resetLink), // ✅ Now works perfectly
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(
        `✅ Employee credentials email sent to ${to}. Message ID: ${info.messageId}`,
      );
    } catch (error) {
      this.logger.error(
        `❌ Failed to send employee credentials email to ${to}`,
        error.stack,
      );
    }
  }
}
