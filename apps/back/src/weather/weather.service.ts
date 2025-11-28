import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { WeatherSnapshot } from '@3xod/shared';

interface WeatherLocation {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

@Injectable()
export class WeatherService {
  private readonly logger = new Logger(WeatherService.name);

  constructor(private readonly configService: ConfigService) {}

  async getSnapshot(location: WeatherLocation): Promise<WeatherSnapshot | undefined> {
    const baseUrl = this.configService.get<string>('WEATHER_API_BASE');
    if (!baseUrl) {
      return undefined;
    }

    try {
      const { data } = await axios.get(baseUrl, {
        params: {
          latitude: location.latitude,
          longitude: location.longitude,
          current_weather: true,
          daily: ['temperature_2m_max', 'temperature_2m_min'],
          timezone: 'auto',
        },
      });

      const current = data.current_weather;
      if (!current) {
        return undefined;
      }

      return {
        provider: 'open-meteo',
        observationTime: new Date().toISOString(),
        temperatureCelsius: current.temperature,
        feelsLikeCelsius: current.temperature,
        description: current.weathercode?.toString() ?? 'Conditions stables',
        humidity: data.hourly?.relativehumidity_2m?.[0] ?? 50,
        windKph: current.windspeed,
        icon: 'sun',
      } satisfies WeatherSnapshot;
    } catch (error) {
      this.logger.warn(`Impossible de récupérer la météo: ${
        error instanceof Error ? error.message : 'erreur inconnue'
      }`);
      return undefined;
    }
  }
}
