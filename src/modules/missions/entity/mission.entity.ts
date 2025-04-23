import { Customer } from './../../customer/entities/customer.entity';
import { Employee } from 'src/modules/employee/entities/employee.entity';
import { MismatchAlert } from 'src/modules/mis-match-alert/entity/mismatch-alert.entity';
import { ToolReading } from 'src/modules/readings/entity/tool-reading.entity';
import { Vehicle } from 'src/modules/vehicles/entity/vehicle.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Mission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  address: string;

  @Column('float')
  latitude: number;

  @Column('float')
  longitude: number;

  @Column({ type: 'datetime' })
  startDate: Date;

  @Column({ type: 'datetime' })
  endDate: Date;

  @Column('simple-array', { nullable: true })
  assignedToolNames: string[];

  @OneToMany(() => ToolReading, (reading) => reading.mission)
  readings: ToolReading[];

  @ManyToMany(() => Employee, (employee) => employee.missions, {
    cascade: true,
  })
  @JoinTable()
  employees: Employee[];

  @ManyToOne(() => Vehicle, { nullable: true })
  @JoinColumn()
  vehicle: Vehicle;

  @OneToMany(() => MismatchAlert, (alert) => alert.mission)
  mismatchAlerts: MismatchAlert[];

  // @Column()
  // CustomerId: number;

  // @Column()
  // employeeIds: number[];
}
