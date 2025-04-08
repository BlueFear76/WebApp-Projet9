// src/employee/employee.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { JwtAuthGuard } from '../authentication/guards/jwt-auth.guard';
import { RolesGuard } from '../authentication/guards/roles.guard';
import { Roles } from '../authentication/decorator/roles.decorator';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Employees')
@ApiBearerAuth() // 👈 Tells Swagger to add Authorization: Bearer
@Controller('employees')
@UseGuards(JwtAuthGuard, RolesGuard) // 👈 Protect the whole controller with JWT + Roles
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post('create')
  @Roles('admin') // 👈 Only Admin can create employees
  @ApiOperation({ summary: 'Create a new employee (Admin only)' })
  @ApiBody({ type: CreateEmployeeDto })
  @ApiResponse({ status: 201, description: 'Employee created successfully' })
  async create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeeService.createEmployee(createEmployeeDto);
  }

  @Get()
  @Roles('admin') // 👈 Only Admin can list all employees
  @ApiOperation({ summary: 'Get all employees (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of employees' })
  async findAll() {
    return this.employeeService.findAll();
  }

  @Get(':id')
  @Roles('admin') // 👈 Only Admin can view employee details
  @ApiOperation({ summary: 'Get an employee by ID (Admin only)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Employee details' })
  async findOne(@Param('id') id: number) {
    return this.employeeService.findOne(id);
  }

  @Delete(':id')
  @Roles('admin') // 👈 Only Admin can delete employees
  @ApiOperation({ summary: 'Delete an employee by ID (Admin only)' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Employee deleted' })
  async remove(@Param('id') id: number) {
    return this.employeeService.delete(id);
  }
}
