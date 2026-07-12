import axios from "axios";

const API_KEY = process.env.WEATHER_API_KEY;

// Common city name corrections
const cityMap = {
  "kallakurichi": "Kallakkurichi",
  "thiruvanamalai": "Tiruvannamalai",
  "tiruvannamalai": "Tiruvannamalai",
  "trichy": "Tiruchirappalli",
  "pondy": "Puducherry",
  "madras": "Chennai"
};

export async function getWeather(city) {

  // Remove extra spaces
  city = city.trim();

  // Convert to lowercase for matching
  const key = city.toLowerCase();

  // Replace with correct city name if available
  if (cityMap[key]) {
    city = cityMap[key];
  }

  try {

    const url =
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)},IN&appid=${API_KEY}&units=metric`;

    const response = await axios.get(url);

    return {
      city: response.data.name,
      temperature: response.data.main.temp,
      pressure: response.data.main.pressure,
      humidity: response.data.main.humidity,
      windSpeed: response.data.wind.speed,
      condition: response.data.weather[0].main
    };

  } catch (error) {

    if (error.response?.status === 404) {

      throw new Error(
        `City "${city}" not found. Please check the spelling or try a nearby major city.`
      );

    }

    throw new Error("Unable to fetch weather data.");
  }

}