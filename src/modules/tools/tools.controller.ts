import { Controller, Post, Body, Get, Param, Patch, Put , Delete } from '@nestjs/common';
import { ToolsService } from './tools.service';
import { CreateToolDto } from './dto/create-tool.dto';
import { ApiTags, ApiBody } from '@nestjs/swagger';

@ApiTags('tools')
@Controller('tools')
export class ToolsController {
  constructor(private readonly toolsService: ToolsService) {}

  @Post()
  create(@Body() createToolDto: CreateToolDto) {
    return this.toolsService.create(createToolDto);
  }

  @Get()
  findAll() {
    return this.toolsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.toolsService.findOne(+id);
  }

  @Patch(':id/assign-rfid')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        rfidTagId: { type: 'string', example: 'E2000017221101441890B31B' },
      },
    },
  })
  async assignRfid(
    @Param('id') id: string,
    @Body() body: { rfidTagId: string },
  ) {
    return this.toolsService.assignRfidTag(+id, body.rfidTagId);
  }


  @Patch(':id')
  async updateAll(
    @Param('id') id : string,
    @Body() body: {
      name: string;
      rfidTagId: string;
      status?: string;
      lastKnownLocation?: string;
    },
  ) {
    return this.toolsService.updateAll(
      Number(id),
      body.name,
      body.rfidTagId,
      body.status || 'inconnu!', 
      body.lastKnownLocation || 'inconnue!'
    );
  }

  
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.toolsService.remove(+id);
  }
}
