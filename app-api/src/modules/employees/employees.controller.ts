import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { LoginDto } from './dto/login.dto';
import { CreateEmployeeDto } from './dto/create-employee.dto';

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  // POST /employees/signup - Sign-up (create a new employee)
  @Post('signup')
  async signUp(@Body() createEmployeeDto: CreateEmployeeDto) {
    const { username, password } = createEmployeeDto;

    // Check if employee already exists
    let employee = await this.employeesService.findOne(username);
    if (employee) {
      throw new HttpException(
        'Employee already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Create new employee
    employee = await this.employeesService.createEmployee(username, password);

    // Generate JWT token for the newly created employee
    const token = await this.employeesService.generateToken(employee);

    // Return the success message and the JWT token
    return {
      message: 'Employee created successfully',
      username: employee.username,
      access_token: token, // Return the JWT token for immediate authentication
    };
  }

  // POST /employees/login - Login (authenticate existing employee)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const { username, password } = loginDto;

    // Validate employee credentials
    const employee = await this.employeesService.validateEmployee(
      username,
      password,
    );
    if (!employee) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    // Generate JWT token
    const token = await this.employeesService.generateToken(employee);

    // Return the token on successful login
    return { access_token: token };
  }
}
