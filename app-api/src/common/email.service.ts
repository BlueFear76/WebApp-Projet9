import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer'; // Ensure correct import for Nodemailer
import { JwtService } from '@nestjs/jwt'; // For token creation

@Injectable()
export class EmailService {
  private transporter;

  constructor(private readonly jwtService: JwtService) {
    // Initialize Nodemailer transport
    this.transporter = nodemailer.createTransport({
      service: 'gmail', // Can be replaced with other services like SendGrid, Mailgun, etc.
      host: 'smtp.gmail.com',
      port: 587,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER || 'godfredmirekuowusu@gmail.com', // Use environment variables
        pass: process.env.EMAIL_PASSWORD || 'myfd jarh ehdd drhy',
      },
    });

    // Check if transporter is initialized correctly
    if (!this.transporter) {
      throw new Error('Failed to initialize email transporter');
    }
  }

  /**
   * Send an email with subject and body
   * @param to Email address to send the email to
   * @param subject Subject of the email
   * @param text Body of the email
   */
  async sendEmail(to: string, subject: string, text: string): Promise<void> {
    const mailOptions = {
      from: process.env.EMAIL_USER || 'godfredmirekuowusu@gmail.com',
      to,
      subject,
      text,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Email sending failed');
    }
  }

  /**
   * Generate a link for password reset or email verification
   * @param token JWT token
   * @param type Type of the link (reset-password or verify-email)
   * @returns Generated URL link
   */
  generateLink(token: string, type: string): string {
    const baseUrl = 'http://localhost:3000'; // Replace with your URL
    return `${baseUrl}/${type}/${token}`; // For example: /reset-password/<token>
  }
  // myfd jarh ehdd drhy
  /**
   * Send password reset email
   * @param email Employee's email
   * @param token JWT token for password reset
   */
  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetLink = this.generateLink(token, 'reset-password');
    const subject = 'Password Reset Request';
    const text = `You requested a password reset. Click the link below to reset your password:\n\n${resetLink}`;
    await this.sendEmail(email, subject, text);
  }

  /**
   * Send email verification link
   * @param email Employee's email
   * @param token JWT token for email verification
   */
  async sendEmailVerification(email: string, token: string): Promise<void> {
    const verificationLink = this.generateLink(token, 'verify-email');
    const subject = 'Email Verification';
    const text = `Please verify your email by clicking the link below:\n\n${verificationLink}`;
    await this.sendEmail(email, subject, text);
  }
}
