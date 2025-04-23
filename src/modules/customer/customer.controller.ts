import {
  Controller,
  Get,
  Delete,
  Patch,
  Post,
  UseInterceptors,
  UploadedFile,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { CustomerService } from './customer.service';
import { Multer } from 'multer';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Customers')
@ApiBearerAuth()
@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  @ApiOperation({ summary: 'Get all customers' })
  @ApiResponse({ status: 200, description: 'List of customers' })
  async findAll() {
    return this.customerService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a customer by ID' })
  @ApiResponse({ status: 200, description: 'Customer found' })
  @ApiResponse({ status: 404, description: 'Customer not found' })
  async findOne(@Param('id') id: string) {
    const customer = await this.customerService.findOneById(+id);
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return customer;
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async importCustomers(@UploadedFile() file: Express.Multer.File) {
    return this.customerService.importFromCsv(file.buffer.toString());
  }

  @Patch()
  @ApiOperation({ summary: 'Update all customers (full replacement)' })
  @ApiResponse({ status: 200, description: 'Customers updated' })
  async updateAll() {
    return this.customerService.updateAll();
  }

  @Delete()
  @ApiOperation({ summary: 'Delete all customers' })
  @ApiResponse({ status: 200, description: 'Customers deleted' })
  async removeAll() {
    return this.customerService.deleteAll();
  }
}
