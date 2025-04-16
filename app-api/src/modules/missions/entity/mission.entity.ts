import { Employee } from 'src/modules/employee/entities/employee.entity';
import { ToolReading } from 'src/modules/readings/entity/tool-reading.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
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
}
