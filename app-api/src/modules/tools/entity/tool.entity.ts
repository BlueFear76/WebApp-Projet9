import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Tool {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: true }) // <-- RFID is optional now
  rfidTagId: string; // Example: E2000017221101441890B31B

  @Column()
  name: string; // Example: Chainsaw

  @Column({ nullable: true })
  description: string; // Optional (Heavy duty chainsaw)

  @Column({ default: 'available' })
  status: string; // available / missing / defective

  @Column({ nullable: true })
  lastKnownLocation: string; // Optional (Truck-001, Warehouse A)
}
