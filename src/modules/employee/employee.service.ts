// src/employee/employee.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import * as bcrypt from 'bcryptjs';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { EmployeeRole } from './entities/employee.entity';
import { randomBytes } from 'crypto'; // 👈 for random password
import { EmailService } from '../email/email.service';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    private readonly emailService: EmailService,
  ) {}

  async createEmployee(
    createEmployeeDto: CreateEmployeeDto,
  ): Promise<Employee> {
    const { firstname, lastname, email } = createEmployeeDto;

    // Check if email already exists
    const existingEmployee = await this.employeeRepository.findOne({
      where: { email },
    });
    if (existingEmployee) {
      throw new NotFoundException('Email already exists');
    }

    if (typeof window !== 'undefined' && !window.crypto) {
      window.crypto = require('crypto').webcrypto;
    }

    // Generate random password
    const generatedPassword = randomBytes(6).toString('hex'); // 12 characters random

    // Hash the password
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    const employee = this.employeeRepository.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      role: EmployeeRole.USER, // Default role is user
    });

    await this.employeeRepository.save(employee);

    // Build full name
    const fullName = `${firstname} ${lastname}`;

    // Send email after saving
    await this.emailService.sendEmployeeCredentials(
      fullName,
      email,
      generatedPassword,
    ); // 👈 Pass fullName, email, password

    return employee;
  }

  async findAll(): Promise<Employee[]> {
    return this.employeeRepository.find();
  }

  async findOne(id: number): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({ where: { id } });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return employee;
  }

  async delete(id: number): Promise<void> {
    const result = await this.employeeRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Employee not found');
    }
  }

  async updateEmployee(
    id: number,
    updateData: Partial<Employee>,
  ): Promise<Employee> {
    const employee = await this.employeeRepository.findOne({ where: { id } });

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    // Met à jour les champs fournis
    Object.assign(employee, updateData);

    return this.employeeRepository.save(employee);
  }
}
