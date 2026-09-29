import React, { useState } from "react";
import {
  CloudRain,
  Wind,
  Droplets,
  CloudLightning,
  Gauge,
  MapPin,
  AlertTriangle,
} from "lucide-react";
import { useWeather } from "../hooks/useWeather";
import { DAMS_DATA } from "../data/damData";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

function WeatherForecast() {
  const [selectedDamName, setSelectedDamName] =
    useState("Hirakud Dam");

  const { weather, hourly, weekly, loading } =
    useWeather(selectedDamName);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-600">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">
            Loading weather data...
          </span>
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="p-6 bg-white border border-red-200 rounded-xl text-red-700">
        Weather data unavailable.
      </div>
    );
  }

  return (
    <div className="space-y-5 text-slate-900">

      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          <div className="flex items-start gap-3">

            <div className="p-2.5 bg-blue-50 rounded-lg">
              <CloudRain className="w-5 h-5 text-blue-600" />
            </div>

            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Catchment Weather Forecast
              </h1>

              <p className="text-sm text-slate-500 mt-1">
                Weather conditions, precipitation forecasts and
                catchment monitoring.
              </p>
            </div>

          </div>

          <div className="flex items-center gap-2">

            <span className="text-xs font-medium text-slate-500">
              Catchment:
            </span>

            <select
              value={selectedDamName}
              onChange={(e) =>
                setSelectedDamName(e.target.value)
              }
              className="bg-white border border-slate-300 text-slate-700 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
            >
              {DAMS_DATA.map((dam) => (
                <option key={dam.id} value={dam.name}>
                  {dam.name} ({dam.river} Basin)
                </option>
              ))}
            </select>

          </div>

        </div>

      </div>

      {/* Current Weather */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

        <div className="p-5">

          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

            {/* Main condition */}
            <div className="flex items-center gap-4">

              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <CloudLightning className="w-10 h-10 text-blue-600" />
              </div>

              <div>

                <div className="flex flex-wrap items-center gap-2">

                  <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                    Live Catchment Conditions
                  </span>

                  <span className="px-2 py-1 bg-red-50 border border-red-200 text-red-700 text-[10px] font-bold rounded-full">
                    IMD RED ALERT
                  </span>

                </div>

                <div className="flex items-baseline gap-2 mt-1">

                  <span className="text-3xl font-bold text-slate-900">
                    {weather.current.temperature}°C
                  </span>

                  <span className="text-sm text-slate-500">
                    {weather.current.condition}
                  </span>

                </div>

                <div className="flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />

                  <span className="text-xs text-slate-500">
                    {weather.current.location}
                  </span>
                </div>

              </div>

            </div>

            {/* Weather Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

              <div className="min-w-[105px] p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <CloudRain className="w-4 h-4 text-blue-600 mb-2" />

                <p className="text-[10px] uppercase font-medium text-slate-500">
                  24h Rain
                </p>

                <p className="text-sm font-bold text-slate-900 mt-1">
                  {weather.current.rainfall24h} mm
                </p>
              </div>

              <div className="min-w-[105px] p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <Wind className="w-4 h-4 text-blue-600 mb-2" />

                <p className="text-[10px] uppercase font-medium text-slate-500">
                  Wind
                </p>

                <p className="text-sm font-bold text-slate-900 mt-1">
                  {weather.current.windSpeed} km/h
                </p>
              </div>

              <div className="min-w-[105px] p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <Droplets className="w-4 h-4 text-blue-600 mb-2" />

                <p className="text-[10px] uppercase font-medium text-slate-500">
                  Humidity
                </p>

                <p className="text-sm font-bold text-slate-900 mt-1">
                  {weather.current.humidity}%
                </p>
              </div>

              <div className="min-w-[105px] p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <Gauge className="w-4 h-4 text-orange-600 mb-2" />

                <p className="text-[10px] uppercase font-medium text-slate-500">
                  Pressure
                </p>

                <p className="text-sm font-bold text-slate-900 mt-1">
                  {weather.current.pressure} hPa
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Rainfall Chart */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm">

        <div className="px-5 py-4 border-b border-slate-200">

          <div>
            <h2 className="text-sm font-bold text-slate-900">
              12-Hour Precipitation Forecast
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Expected catchment rainfall intensity in mm/hour.
            </p>
          </div>

        </div>

        <div className="p-5">

          <div className="h-64 w-full">

            <ResponsiveContainer width="100%" height="100%">

              <BarChart
                data={hourly}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 5,
                }}
              >

                <XAxis
                  dataKey="time"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />

                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  unit=" mm"
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderColor: "#e2e8f0",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />

                <Bar
                  dataKey="rainfall"
                  name="Rainfall (mm)"
                  fill="#2563eb"
                  radius={[5, 5, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

      {/* 7 Day Forecast */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm">

        <div className="px-5 py-4 border-b border-slate-200">

          <h2 className="text-sm font-bold text-slate-900">
            7-Day River Basin Forecast
          </h2>

          <p className="text-xs text-slate-500 mt-1">
            Forecast rainfall, temperature and warning level.
          </p>

        </div>

        <div className="p-5">

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">

            {weekly.map((day, idx) => {

              const isRed = day.warning === "RED";
              const isOrange = day.warning === "ORANGE";

              return (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-center ${
                    isRed
                      ? "bg-red-50 border-red-200"
                      : isOrange
                      ? "bg-orange-50 border-orange-200"
                      : "bg-slate-50 border-slate-200"
                  }`}
                >

                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      {day.day}
                    </p>

                    <p className="text-[10px] text-slate-500 mt-0.5">
                      {day.date}
                    </p>
                  </div>

                  <div className="my-3">

                    <CloudRain
                      className={`w-6 h-6 mx-auto ${
                        isRed
                          ? "text-red-600"
                          : isOrange
                          ? "text-orange-600"
                          : "text-blue-600"
                      }`}
                    />

                  </div>

                  <p className="text-sm font-bold text-slate-900">
                    {day.rainfall} mm
                  </p>

                  <p className="text-[10px] text-slate-500 mt-1">
                    {day.tempMax}° / {day.tempMin}°
                  </p>

                  {day.warning && (
                    <span
                      className={`inline-block mt-2 px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        isRed
                          ? "bg-red-100 text-red-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {day.warning} ALERT
                    </span>
                  )}

                </div>
              );
            })}

          </div>

        </div>

      </div>

      {/* Weather Alert Notice */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">

        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />

        <div>

          <p className="text-sm font-semibold text-amber-800">
            Weather Monitoring Notice
          </p>

          <p className="text-xs text-amber-700 mt-1 leading-5">
            Forecast information should be interpreted alongside official
            meteorological and disaster-management advisories. Conditions
            can change rapidly during severe weather events.
          </p>

        </div>

      </div>

    </div>
  );
}

export { WeatherForecast };
export default WeatherForecast;