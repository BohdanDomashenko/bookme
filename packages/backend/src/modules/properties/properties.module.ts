import { Module } from '@nestjs/common';
import { PropertiesController } from './properties.controller';
import { PropertiesService } from './properties.service';

@Module({
  providers: [PropertiesService],
  controllers: [PropertiesController],
  exports: [PropertiesService],
})
export class PropertiesModule {}
