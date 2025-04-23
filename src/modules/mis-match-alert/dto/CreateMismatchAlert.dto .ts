import { IsArray, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateMismatchAlertDto {
  @IsNumber()
  missionId: number;

  @IsArray()
  mismatchedTags: string[];
}
