// src/authentication/authentication.controller.ts

import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { RegisterAdminDto } from './dtos/register-admin.dto';
import { LoginDto } from './dtos/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { Employee } from '../employee/entities/employee.entity';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ResetPasswordDto } from '../employee/dto/reset-password.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register-admin')
  @ApiOperation({ summary: 'Register Admin' })
  @ApiBody({ type: RegisterAdminDto })
  @ApiResponse({ status: 201, description: 'Admin registered successfully' })
  async registerAdmin(@Body() registerAdminDto: RegisterAdminDto) {
    return this.authenticationService.registerAdmin(registerAdminDto);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard) // 👈 use your new LocalAuthGuard class
  @ApiOperation({ summary: 'Login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Logged in successfully' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Req() req: Request) {
    return this.authenticationService.login(req.user as any);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authenticationService.resetPassword(resetPasswordDto);
  }
}
