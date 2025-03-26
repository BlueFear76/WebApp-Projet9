import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './employees.entity';

@Injectable()
export class EmployeesRepository {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  // Find an employee by username
  async findOneByUsername(username: string): Promise<Employee | null> {
    return this.employeeRepository.findOne({ where: { username } });
  }

  // Create and save a new employee
  async createEmployee(username: string, password: string): Promise<Employee> {
    const employee = this.employeeRepository.create({ username, password });
    return this.employeeRepository.save(employee); // Save employee to DB
  }

  // Find an employee by ID
  async findOneById(id: number): Promise<Employee | null> {
    return this.employeeRepository.findOne({ where: { id } });
  }
}
