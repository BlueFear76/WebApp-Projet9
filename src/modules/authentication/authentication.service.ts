// src/authentication/authentication.service.ts

import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee, EmployeeRole } from '../employee/entities/employee.entity';
import { RegisterAdminDto } from './dtos/register-admin.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dtos/login.dto';
import { ResetPasswordDto } from '../employee/dto/reset-password.dto';

@Injectable()
export class AuthenticationService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    private jwtService: JwtService,
  ) {}

  async registerAdmin(registerAdminDto: RegisterAdminDto): Promise<Employee> {
    const { firstname, lastname, email, password } = registerAdminDto;
    const existingUser = await this.employeeRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = this.employeeRepository.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      role: EmployeeRole.ADMIN,
    });

    return this.employeeRepository.save(newAdmin);
  }

  // src/authentication/authentication.service.ts
  // src/authentication/authentication.service.ts
  async validateUser(
    email: string,
    password: string,
  ): Promise<Employee | null> {
    const user = await this.employeeRepository.findOne({ where: { email } });

    if (user) {
      const passwordMatches = await bcrypt.compare(password, user.password);

      if (passwordMatches) {
        return user;
      }
    }
    return null;
  }

  async login(user: Employee) {
    const payload = { email: user.email, sub: user.id, role: user.role, firstName : user.firstname, lastName : user.lastname};
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    const { email, newPassword } = resetPasswordDto;

    const user = await this.employeeRepository.findOne({ where: { email } });

    if (!user) {
      throw new Error('User not found');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    await this.employeeRepository.save(user);

    return { message: 'Password reset successfully' };
  }
}
