import { getWeather } from "./weather.js";

export async function detectCycloneRisk(city) {

  const weather = await getWeather(city);

  let risk = "LOW";

  if (weather.windSpeed > 10 || weather.pressure < 1005) {
    risk = "MODERATE";
  }

  if (weather.windSpeed > 15 || weather.pressure < 1000) {
    risk = "HIGH";
  }

  return {
    city: weather.city,
    temperature: weather.temperature,
    pressure: weather.pressure,
    humidity: weather.humidity,
    windSpeed: weather.windSpeed,
    condition: weather.condition,
    risk: risk
  };

}