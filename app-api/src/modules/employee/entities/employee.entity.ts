// src/employee/entities/employee.entity.ts

import { Mission } from 'src/modules/missions/entity/mission.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';

export enum EmployeeRole {
  ADMIN = 'admin',
  USER = 'user',
  SUPERADMIN = 'superAdmin',
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

  @Column({ type: 'varchar', default: EmployeeRole.USER })
  role: EmployeeRole;
}
