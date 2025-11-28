import { Module } from '@nestjs/common';
import { WeatherService } from './weather.service.js';

@Module({
  providers: [WeatherService],
  exports: [WeatherService],
})
export class WeatherModule {}
