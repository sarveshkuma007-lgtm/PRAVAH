import { MOCK_WEATHER_DATA } from "../data/mockWeather";

export const weatherService = {
  async getWeatherForCatchment(damName = "Hirakud Dam") {
    // Structured for future OpenWeather / IMD Weather API integration
    return Promise.resolve({
      ...MOCK_WEATHER_DATA,
      targetDam: damName,
    });
  },

  async getHourlyForecast() {
    return Promise.resolve(MOCK_WEATHER_DATA.hourlyForecast);
  },

  async getWeeklyForecast() {
    return Promise.resolve(MOCK_WEATHER_DATA.weeklyForecast);
  },

  getRainfallSeverity(mm) {
    if (mm >= 120) return { label: "Extremely Heavy", level: "CRITICAL", color: "text-red-400" };
    if (mm >= 65) return { label: "Very Heavy", level: "HIGH", color: "text-orange-400" };
    if (mm >= 35) return { label: "Moderate to Heavy", level: "MODERATE", color: "text-amber-400" };
    return { label: "Light to Normal", level: "NORMAL", color: "text-emerald-400" };
  },
};
