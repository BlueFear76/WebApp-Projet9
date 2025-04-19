import { Injectable } from '@nestjs/common';
import * as csv from 'csv-parser';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { Repository } from 'typeorm';
import { Readable } from 'stream';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async findAll(): Promise<Customer[]> {
    return this.customerRepository.find();
  }

  async updateAll(): Promise<Customer[]> {
    const customers = await this.customerRepository.find();

    for (const customer of customers) {
      customer.addresses = 'Updated address';
      await this.customerRepository.save(customer);
    }

    return customers;
  }

  async deleteAll(): Promise<void> {
    await this.customerRepository.clear();
  }

  async importFromCsv(csvData: string): Promise<Customer[]> {
    const customers: Customer[] = [];
  
    await new Promise<void>((resolve, reject) => {
      Readable.from([csvData])
        .pipe(csv({ separator: ';' }))
        .on('data', (row) => {
          const customer = this.customerRepository.create({
            firstName: row.firstName || null,
            lastName: row.lastName || null,
            companyName: row.companyName || null,
            email: row.email || null,
            phoneNumber: row.phone || '',
            addresses: row.addresses || '',
          });
          customers.push(customer);
        })
        .on('end', () => resolve())
        .on('error', (err) => reject(err));
    });
  
    await this.deleteAll();
    return this.customerRepository.save(customers);
  }

  async findOneById(id: number) {
    return this.customerRepository.findOne({ where: { id } });
  }
}
