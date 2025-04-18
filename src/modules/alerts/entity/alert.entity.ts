import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Mission } from '../../missions/entity/mission.entity';

@Entity()
export class Alert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  toolTagId: string; // Missing tool's RFID tag ID

  @Column()
  vehicleId: string; // Truck that reported it

  @Column()
  message: string; // Like "Tool missing after mission"

  @Column('datetime')
  detectedAt: Date; // When the alert was created

  @Column({ nullable: true })
  toolName: string; // Real tool name

  @Column({ nullable: true })
  locationAddress: string; //

  @ManyToOne(() => Mission, { nullable: true })
  mission: Mission;
}
