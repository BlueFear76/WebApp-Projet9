import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './employees.entity';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { EmployeesRepository } from './employees.repository';
@Injectable()
export class EmployeesService {
  constructor(private readonly employeeRepository: EmployeesRepository) {}

  async createEmployee(username: string, password: string): Promise<Employee> {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    return this.employeeRepository.createEmployee(username, hashedPassword); // Save employee to DB
  }

  async findOne(username: string): Promise<Employee | null> {
    return this.employeeRepository.findOneByUsername(username);
  }

  async validateEmployee(
    username: string,
    password: string,
  ): Promise<Employee | null> {
    const employee = await this.findOne(username); // Find the employee by username
    if (employee && bcrypt.compareSync(password, employee.password)) {
      return employee; // Return the employee object if the password matches
    }
    return null; // Return null if the employee is not found or password is incorrect
  }

  async generateToken(employee: Employee): Promise<string> {
    const payload = { username: employee.username, sub: employee.id }; // JWT payload
    return jwt.sign(payload, 'your_jwt_secret', { expiresIn: '1h' }); // JWT token with expiration
  }
}
