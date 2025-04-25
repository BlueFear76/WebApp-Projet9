// src/modules/alerts/dto/create-alert.dto.ts

import { IsArray, IsNumber, IsString } from 'class-validator';

export class CreateAlertDto {
  @IsArray()
  @IsString({ each: true })
  toolTagIds: string[];

  @IsNumber()
  missionId: number;
}
