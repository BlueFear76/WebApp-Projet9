import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';
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

  @Patch(':id/update-status')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'missing' },
      },
    },
  })
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    return this.toolsService.updateStatus(+id, body.status);
  }
}
