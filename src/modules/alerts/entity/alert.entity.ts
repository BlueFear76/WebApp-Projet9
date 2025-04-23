import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Mission } from '../../missions/entity/mission.entity';

@Entity()
export class Alert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('simple-json')
  toolTagId: string[];

  @ManyToOne(() => Mission, { nullable: true })
  mission: Mission; // Reference to the mission associated with the alert
}
