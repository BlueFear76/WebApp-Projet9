// src/employee/entities/employee.entity.ts

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum EmployeeRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'text', default: EmployeeRole.USER })
  role: EmployeeRole;
}
