import { Module } from '@nestjs/common';
import { DestinationsService } from './destinations.service.js';

@Module({
  providers: [DestinationsService],
  exports: [DestinationsService],
})
export class DestinationsModule {}
