export interface DailyForecast {
  date: string
  minTemp: number
  maxTemp: number
  condition: string
  icon: string
  precipitationChance: number
  humidity: number
  windSpeed: number
}

export interface WeatherForecast {
  locationName: string
  currentTemp: number
  currentCondition: string
  currentIcon: string
  feelsLike: number
  humidity: number
  windSpeed: number
  forecast: DailyForecast[]
  updatedAt: string
}

export interface WeatherData {
  bestTimeToVisit: string
  typicalWeather: {
    month: number
    avgHigh: number
    avgLow: number
    rainfall: number
    description: string
  }[]
  currentForecast?: WeatherForecast
}
