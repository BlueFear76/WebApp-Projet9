import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import * as bcrypt from 'bcryptjs'; // or bcryptjs
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { EmployeeRole } from './entities/employee.entity';
import { nanoid } from 'nanoid'; // Static import
import { v4 as uuidv4 } from 'uuid'; // Static import
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

    const existingEmployee = await this.employeeRepository.findOne({
      where: { email },
    });
    if (existingEmployee) {
      throw new ConflictException('Email already exists');
    }

    const generatedPassword = uuidv4().replace(/-/g, '').slice(0, 12); // Generate a random password
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    const employee = this.employeeRepository.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      role: EmployeeRole.USER,
    });

    await this.employeeRepository.save(employee);

    await this.emailService.sendEmployeeCredentials(
      `${firstname} ${lastname}`,
      email,
      generatedPassword,
    );

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
