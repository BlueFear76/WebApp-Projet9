import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Mission } from '../../missions/entity/mission.entity';

@Entity()
export class ToolReading {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  vehicleId: string; // Truck ID (can be a string or int depending on your system)

  @Column('simple-array')
  toolTagIds: string[]; // List of scanned RFID tag IDs

  @Column('float')
  latitude: number; // GPS position

  @Column('float')
  longitude: number;

  @Column()
  address: string; // Real address from GPS

  @Column({ type: 'datetime' })
  scannedAt: Date; // Time of scan

  @ManyToOne(() => Mission, (mission) => mission.readings, { nullable: true })
  mission: Mission;
}
