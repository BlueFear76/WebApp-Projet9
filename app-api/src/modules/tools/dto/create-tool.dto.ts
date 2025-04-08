import { ApiProperty } from '@nestjs/swagger';

export class CreateToolDto {
  @ApiProperty({
    example: 'E2000017221101441890B31B',
    description: 'Unique RFID tag ID of the tool',
    required: false, // <-- Optional now
  })
  rfidTagId?: string;

  @ApiProperty({
    example: 'Chainsaw',
    description: 'Name of the tool',
  })
  name: string;

  @ApiProperty({
    example: 'Heavy duty chainsaw for cutting trees',
    description: 'Description of the tool',
    required: false,
  })
  description?: string;
}
