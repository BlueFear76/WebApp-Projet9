import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Mission } from '../../missions/entity/mission.entity';

@Entity()
export class MismatchAlert {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Mission, (mission) => mission.mismatchAlerts, {
    onDelete: 'CASCADE',
  })
  mission: Mission;

  @Column('simple-array')
  mismatchedTags: string[];

  @Column('float')
  latitude: number;

  @Column('float')
  longitude: number;

  @CreateDateColumn()
  createdAt: Date;
}
