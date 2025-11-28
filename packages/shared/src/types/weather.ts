export interface WeatherAlert {
  id: string;
  title: string;
  severity: 'info' | 'watch' | 'warning';
  description: string;
}

export interface WeatherSnapshot {
  provider: 'open-meteo' | 'tomorrow-io' | 'unknown';
  observationTime: string;
  temperatureCelsius: number;
  feelsLikeCelsius: number;
  description: string;
  humidity: number;
  windKph: number;
  icon: string;
  alerts?: WeatherAlert[];
}
