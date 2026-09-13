import { useState, useEffect } from "react";
import { weatherService } from "../services/weatherService";

export function useWeather(damName = "Hirakud Dam") {
  const [weather, setWeather] = useState(null);
  const [hourly, setHourly] = useState([]);
  const [weekly, setWeekly] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      const [w, h, wk] = await Promise.all([
        weatherService.getWeatherForCatchment(damName),
        weatherService.getHourlyForecast(),
        weatherService.getWeeklyForecast(),
      ]);

      if (mounted) {
        setWeather(w);
        setHourly(h);
        setWeekly(wk);
        setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [damName]);

  return { weather, hourly, weekly, loading };
}

export default useWeather;
