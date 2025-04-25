import { Module } from '@nestjs/common';
import { ToolsController } from './tools.controller';
import { ToolsService } from './tools.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tool } from './entity/tool.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Tool])], // Add your entities here
  controllers: [ToolsController],
  providers: [ToolsService],
  exports: [ToolsService], // Export the service if needed in other modules
})
export class ToolsModule {}
