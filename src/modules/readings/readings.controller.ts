// import { Controller, Post, Body, Get, Delete, Param } from '@nestjs/common';
// import { ReadingsService } from './readings.service';
// import { CreateToolReadingDto } from './dto/create-tool-reading.dto';
// import { ApiTags } from '@nestjs/swagger';

// @ApiTags('readings')
// @Controller('readings')
// export class ReadingsController {
//   constructor(private readonly readingsService: ReadingsService) {}

//   @Post()
//   create(@Body() createToolReadingDto: CreateToolReadingDto) {
//     return this.readingsService.create(createToolReadingDto);
//   }

//   @Get()
//   findAll() {
//     return this.readingsService.findAll();
//   }

//   @Delete(':id')
//   async remove(@Param('id') id: string) {
//     return this.readingsService.remove(+id);
//   }
// }
