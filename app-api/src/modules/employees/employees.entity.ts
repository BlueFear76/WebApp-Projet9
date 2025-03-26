import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: number; // Auto-generated ID for the employee

  @Column({ unique: true })
  username: string; // Username for the employee (must be unique)

  @Column()
  password: string; // Hashed password for the employee
}
