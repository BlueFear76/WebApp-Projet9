import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MismatchAlert } from './entity/mismatch-alert.entity';
import { Repository } from 'typeorm';
import { CreateMismatchAlertDto } from './dto/CreateMismatchAlert.dto ';
import { MissionsService } from '../missions/missions.service';

@Injectable()
export class MismatchAlertService {
  constructor(
    @InjectRepository(MismatchAlert)
    private alertRepo: Repository<MismatchAlert>,
    private readonly missionsService: MissionsService,
  ) {}

  async create(dto: CreateMismatchAlertDto): Promise<MismatchAlert> {
    const mission = await this.missionsService.findOne(dto.missionId);

    const alert = this.alertRepo.create({
      mission,
      mismatchedTags: dto.mismatchedTags,
    });

    return this.alertRepo.save(alert);
  }

  async findAll(): Promise<MismatchAlert[]> {
    return this.alertRepo.find({ relations: ['mission'] });
  }

  async findByMission(missionId: number): Promise<MismatchAlert[]> {
    return this.alertRepo.find({
      where: { mission: { id: missionId } },
      relations: ['mission'],
    });
  }
}
