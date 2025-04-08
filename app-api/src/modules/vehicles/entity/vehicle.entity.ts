import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Mission } from '../../missions/entity/mission.entity';

@Entity()
export class Vehicle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  vehicleId: string; // Example: "Truck-001"

  @OneToOne(() => Mission, { nullable: true })
  @JoinColumn()
  activeMission: Mission; // Mission assigned to this vehicle
}
