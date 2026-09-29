import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  Bell,
  CloudRain,
  Droplets,
  Gauge,
  MapPin,
  ArrowUpRight,
  ShieldCheck,
  FileText,
  Route,
  Building2,
  BarChart3,
  ChevronRight,
  Settings2,
} from "lucide-react";

import { useEmergency } from "../context/EmergencyContext";
import { useWeather } from "../hooks/useWeather";
import { damService } from "../services/damService";
import { DAMS_DATA } from "../data/damData";
import { FloodMap } from "../components/FloodMap";


const DAM_IMAGES = {
  "dam-tehri": "/images/dams/tehri-dam.webp.webp",
  "dam-hirakud": "/images/dams/hirakud-dam.webp.webp",
  "dam-sardar-sarovar": "/images/dams/sardar-sarovar-dam.jpg.jpg",
  "dam-bhakra": "/images/dams/bhakra-dam.webp.webp",
  "dam-rihand": "/images/dams/rihand-dam.jpg.jpg",
  "dam-idukki": "/images/dams/idukki-dam.jpg.jpg",
  "dam-nagarjuna": "/images/dams/nagarjuna-sagar-dam.jpg.jpg",
  "dam-koyna": "/images/dams/koyna-dam.jpg.jpg",
};


export function Dashboard() {
  const {
    alerts,
    activeAlertsCount,
    criticalAlertsCount,
  } = useEmergency();

  const [selectedDam, setSelectedDam] = useState(
    DAMS_DATA.find((d) =>
      d.name?.toLowerCase().includes("hirakud")
    ) || DAMS_DATA[0]
  );

  const [hydroData, setHydroData] = useState([]);

  useEffect(() => {
    if (selectedDam) {
      setHydroData(
        damService.getWaterLevelTrend(selectedDam.id, 24)
      );
    }
  }, [selectedDam]);

  const { weather } = useWeather(
    selectedDam?.name || "Hirakud Dam"
  );

  const current = weather?.current;

  const criticalDams = DAMS_DATA.filter((d) =>
    ["CRITICAL", "HIGH"].includes(d.riskLevel)
  );

  const avgStorage = Math.round(
    DAMS_DATA.reduce(
      (sum, d) => sum + Number(d.storagePercentage || 0),
      0
    ) / Math.max(DAMS_DATA.length, 1)
  );

  const waterLevel =
    selectedDam?.currentWaterLevel ?? 124.6;

  const inflow =
    selectedDam?.inflow ?? 12450;

  const outflow =
    selectedDam?.outflow ?? 10800;

  const storage =
    selectedDam?.storagePercentage ?? 81;

  return (
    <div className="pravah-dashboard min-h-full space-y-5 bg-slate-50 text-slate-900 -m-4 sm:-m-6 md:-m-8 p-4 sm:p-6 lg:p-7">

      {/* ================= HERO ================= */}

      <section
        className="relative min-h-[175px] overflow-hidden rounded-2xl bg-slate-900 shadow-sm"
        style={{
          backgroundImage: `url("${DAM_IMAGES[selectedDam?.id] || DAM_IMAGES["dam-hirakud"]}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/65 to-slate-950/35" />
        <div className="absolute inset-0 bg-black/10" />

        <div className="relative z-10 flex min-h-[175px] flex-col justify-between p-6 lg:p-7">

          <span className="w-fit rounded-full border border-emerald-300/30 bg-emerald-400/10 px-3 py-1 text-[11px] font-bold text-emerald-300">
            ● REAL-TIME MONITORING
          </span>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-white lg:text-5xl">
                {selectedDam?.name || "Hirakud Dam"}
              </h1>

              <p className="mt-1 text-xs font-semibold text-sky-200">
                {selectedDam?.state || "India"} · {selectedDam?.river || "River Basin"}
              </p>

              <p className="mt-1 text-sm text-slate-200 lg:text-base">
                Safe Rivers
                <span className="mx-2">|</span>
                Safer Communities
                <span className="mx-2">|</span>
                A Resilient Tomorrow
              </p>
            </div>

            <div className="flex overflow-hidden rounded-xl border border-white/15 bg-slate-950/65 backdrop-blur-md">

              <HeroMetric
                label="Water Level"
                value={`${waterLevel} m`}
                change="+2.8 m"
              />

              <HeroMetric
                label="Inflow (24h)"
                value={`${Number(inflow).toLocaleString()} m³/s`}
              />

              <HeroMetric
                label="Outflow (24h)"
                value={`${Number(outflow).toLocaleString()} m³/s`}
              />

              <HeroMetric
                label="Storage Level"
                value={`${storage}%`}
                progress={storage}
              />

            </div>
          </div>
        </div>
      </section>

      {/* ================= KPI ================= */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <MetricCard
          icon={Droplets}
          title="Monitored Dams"
          value={DAMS_DATA.length}
          subtitle="7 Normal  |  1 Warning"
        />

        <MetricCard
          icon={AlertTriangle}
          title="High Risk Dams"
          value={criticalDams.length}
          danger
          subtitle="2 Critical  |  1 Moderate"
        />

        <MetricCard
          icon={Gauge}
          title="Reservoir Storage"
          value={`${avgStorage}%`}
          subtitle="Live storage across all monitored dams"
          progress={avgStorage}
        />

        <MetricCard
          icon={Bell}
          title="Active Alerts"
          value={activeAlertsCount}
          warning
          subtitle={`${criticalAlertsCount} Critical  |  1 High  |  1 Medium`}
        />

      </div>

      {/* ================= MAIN ================= */}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">

        <div className="min-w-0">

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[270px_minmax(0,1fr)]">

            {/* DAM DETAILS */}

            <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

              <SectionTitle
                icon={Activity}
                title="Dam Monitoring"
              />

              <label className="mt-4 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Select Reservoir
              </label>

              <select
                value={selectedDam?.id || ""}
                onChange={(e) =>
                  setSelectedDam(
                    DAMS_DATA.find(
                      (d) => d.id === e.target.value
                    ) || selectedDam
                  )
                }
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 outline-none focus:border-blue-500"
              >
                {DAMS_DATA.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>

              <div className="mt-4 space-y-3">

                <InfoRow
                  label="Location"
                  value={selectedDam?.state || "Odisha"}
                />

                <InfoRow
                  label="River"
                  value={selectedDam?.river || "Mahanadi"}
                />

                <InfoRow
                  label="Risk Level"
                  value={selectedDam?.riskLevel || "CRITICAL"}
                  danger
                />

                <InfoRow
                  label="Current Water Level"
                  value={`${waterLevel} m`}
                />

                <InfoRow
                  label="Full Reservoir Level"
                  value={`${selectedDam?.dangerLevel || 630} m`}
                />

                <InfoRow
                  label="Inflow (24h)"
                  value={`${Number(inflow).toLocaleString()} m³/s`}
                />

                <InfoRow
                  label="Outflow (24h)"
                  value={`${Number(outflow).toLocaleString()} m³/s`}
                />

                <InfoRow
                  label="Spillway Status"
                  value={outflow > 0 ? "Discharging" : "Normal"}
                  danger={outflow > 0}
                />

              </div>

              <Link
                to={`/dam/${selectedDam?.id}`}
                className="mt-4 flex items-center justify-center rounded-lg border border-blue-500 bg-blue-50 py-2 text-sm font-bold text-blue-600 hover:bg-blue-100"
              >
                View Detailed Data
                <ArrowUpRight className="ml-1 h-4 w-4" />
              </Link>

            </section>

            {/* MAP */}

            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">

                <SectionTitle
                  icon={MapPin}
                  title="Live Flood Map"
                  subtitle="Reservoirs, Flood Zones and Downstream Risk"
                />

                <div className="flex rounded-lg bg-slate-100 p-1">
                  <button className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-bold text-white">
                    Map
                  </button>

                  <button className="px-3 py-1.5 text-xs text-slate-600">
                    Satellite
                  </button>

                  <button className="px-3 py-1.5 text-xs text-slate-600">
                    Terrain
                  </button>
                </div>

              </div>

              <div className="p-2">
                <FloodMap
                  selectedDam={selectedDam}
                  height="500px"
                />
              </div>

            </section>

          </div>

          {/* QUICK ACTIONS */}

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1.7fr_.8fr_1fr]">

            <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

              <SectionTitle
                icon={Settings2}
                title="Quick Actions"
              />

              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">

                <QuickAction
                  to="/dam-monitoring"
                  icon={Building2}
                  label="View Dams"
                />

                <QuickAction
                  to="/weather"
                  icon={CloudRain}
                  label="Check Forecast"
                />

                <QuickAction
                  to="/alerts"
                  icon={Bell}
                  label="View Alerts"
                  danger
                />

                <QuickAction
                  to="/safe-routes"
                  icon={Route}
                  label="Safe Routes"
                />

                <QuickAction
                  to="/reports"
                  icon={FileText}
                  label="Generate Report"
                />

              </div>

            </section>

            {/* SYSTEM STATUS */}

            <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

              <SectionTitle
                icon={ShieldCheck}
                title="System Status"
              />

              <div className="mt-3 space-y-2 text-xs">

                <Status
                  label="Telemetry Network"
                  value="Online"
                />

                <Status
                  label="GIS Services"
                  value="Connected"
                />

                <Status
                  label="Weather Service"
                  value="Available"
                />

                <Status
                  label="AI Risk Engine"
                  value="Ready"
                />

              </div>

            </section>

            {/* PREPAREDNESS */}

            <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

              <SectionTitle
                icon={ShieldCheck}
                title="Disaster Preparedness"
              />

              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                Access evacuation routes, shelter locations and emergency contacts.
              </p>

              <Link
                to="/safe-routes"
                className="mt-3 block rounded-lg border border-blue-500 py-2 text-center text-xs font-bold text-blue-600 hover:bg-blue-50"
              >
                View Safety Resources →
              </Link>

            </section>

          </div>

        </div>

        {/* RIGHT COLUMN */}

        <aside className="space-y-4">

          <WeatherPanel current={current} />

          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">

              <SectionTitle
                icon={Bell}
                title="Recent Alerts"
              />

              <Link
                to="/alerts"
                className="text-xs font-bold text-blue-600"
              >
                View All →
              </Link>

            </div>

            <div className="divide-y divide-slate-100">

              {alerts.slice(0, 4).map((alert, index) => (

                <div
                  key={alert.id || index}
                  className="p-3.5"
                >

                  <div className="flex items-center justify-between">

                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-black uppercase ${
                        index === 0
                          ? "bg-red-100 text-red-600"
                          : index === 1
                          ? "bg-orange-100 text-orange-600"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {index === 0
                        ? "Critical"
                        : index === 1
                        ? "High"
                        : "Medium"}
                    </span>

                    <span className="text-[10px] text-slate-400">
                      {index * 2 + 1}h ago
                    </span>

                  </div>

                  <p className="mt-2 text-sm font-bold text-slate-800">
                    {alert.title || "Rising Water Level"}
                  </p>

                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    {alert.description ||
                      "Water level requires continued monitoring and response readiness."}
                  </p>

                </div>

              ))}

            </div>

          </section>

        </aside>

      </div>

      {/* NATIONAL OVERVIEW */}

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">

          <SectionTitle
            icon={BarChart3}
            title="National Hydrology Overview"
            subtitle="24-hour reservoir telemetry and response readiness"
          />

          <Link
            to="/analytics"
            className="text-xs font-bold text-blue-600"
          >
            Open Analytics →
          </Link>

        </div>

        <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">

          <MiniStat
            label="Water level trend"
            value="+2.8 m"
            positive
          />

          <MiniStat
            label="Average storage"
            value={`${avgStorage}%`}
          />

          <MiniStat
            label="Critical bulletins"
            value={criticalAlertsCount}
            danger
          />

          <MiniStat
            label="Network uptime"
            value="99.8%"
            positive
          />

        </div>

      </section>

    </div>
  );
}

function HeroMetric({ label, value, change, progress }) {
  return (
    <div className="min-w-[120px] px-4 py-3">

      <div className="text-[10px] uppercase tracking-wide text-slate-400">
        {label}
      </div>

      <div className="mt-1 text-sm font-extrabold text-white">
        {value}
      </div>

      {change && (
        <div className="text-[10px] font-bold text-emerald-400">
          ↑ {change}
        </div>
      )}

      {progress != null && (
        <div className="mt-1.5 h-1.5 w-20 overflow-hidden rounded-full bg-slate-700">
          <div
            className="h-full rounded-full bg-sky-400"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

    </div>
  );
}

function MetricCard({
  icon: Icon,
  title,
  value,
  subtitle,
  danger,
  warning,
  progress,
}) {
  return (
    <div
      className={`rounded-xl border bg-white p-4 shadow-sm ${
        danger
          ? "border-red-200 bg-red-50/30"
          : warning
          ? "border-orange-200 bg-orange-50/20"
          : "border-slate-200"
      }`}
    >

      <div className="flex items-start justify-between">

        <div
          className={`rounded-xl p-3 ${
            danger
              ? "bg-red-100 text-red-600"
              : warning
              ? "bg-orange-100 text-orange-600"
              : "bg-blue-50 text-blue-600"
          }`}
        >
          <Icon className="h-6 w-6" />
        </div>

        <ChevronRight className="h-5 w-5 text-slate-300" />

      </div>

      <div className="mt-3 text-xs font-semibold text-slate-500">
        {title}
      </div>

      <div className="mt-0.5 text-3xl font-black text-slate-900">
        {value}
      </div>

      {progress != null && (
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-blue-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="mt-2 text-[11px] text-slate-500">
        {subtitle}
      </div>

    </div>
  );
}

function WeatherPanel({ current }) {
  if (!current) {
    return (
      <div className="h-52 animate-pulse rounded-xl border border-slate-200 bg-white" />
    );
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

      <div className="flex items-center justify-between">

        <SectionTitle
          icon={CloudRain}
          title="Catchment Weather"
        />

        <Link
          to="/weather"
          className="text-xs font-bold text-blue-600"
        >
          View Forecast →
        </Link>

      </div>

      <div className="mt-3 rounded-lg bg-sky-50 p-3">

        <div className="flex items-center justify-between">

          <div>

            <div className="text-3xl font-black text-slate-900">
              {current.temperature ?? 24}°C
            </div>

            <div className="text-xs text-slate-500">
              {current.location || "Sambalpur, Odisha"}
            </div>

            <div className="text-xs text-slate-500">
              {current.condition || "Light Rain"}
            </div>

          </div>

          <CloudRain className="h-12 w-12 text-blue-500" />

        </div>

      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">

        <WeatherMetric
          icon={Droplets}
          label="24h Rainfall"
          value={`${current.rainfall24h ?? 124.6} mm`}
        />

        <WeatherMetric
          icon={ArrowUpRight}
          label="Wind Speed"
          value={`${current.windSpeed ?? 38} km/h`}
        />

        <WeatherMetric
          icon={Droplets}
          label="Humidity"
          value={`${current.humidity ?? 92}%`}
        />

        <WeatherMetric
          icon={Gauge}
          label="Pressure"
          value={`${current.pressure ?? 996} hPa`}
        />

      </div>

    </section>
  );
}

function WeatherMetric({ icon: Icon, label, value }) {
  return (
    <div className="border-t border-slate-100 pt-2">

      <div className="flex items-center gap-1 text-[10px] text-slate-400">
        <Icon className="h-3.5 w-3.5 text-blue-500" />
        {label}
      </div>

      <div className="mt-1 font-extrabold text-slate-800">
        {value}
      </div>

    </div>
  );
}

function SectionTitle({ icon: Icon, title, subtitle }) {
  return (
    <div className="flex items-start gap-2">

      <Icon className="mt-0.5 h-4 w-4 text-blue-600" />

      <div>
        <h2 className="text-sm font-extrabold text-slate-800">
          {title}
        </h2>

        {subtitle && (
          <p className="text-[10px] text-slate-400">
            {subtitle}
          </p>
        )}
      </div>

    </div>
  );
}

function InfoRow({ label, value, danger }) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2 last:border-0 last:pb-0">

      <span className="text-xs text-slate-500">
        {label}
      </span>

      <span
        className={`text-xs font-bold ${
          danger ? "text-red-600" : "text-slate-800"
        }`}
      >
        {value}
      </span>

    </div>
  );
}

function QuickAction({ to, icon: Icon, label, danger }) {
  return (
    <Link
      to={to}
      className={`flex min-h-[72px] flex-col items-center justify-center rounded-lg border p-2 text-center transition ${
        danger
          ? "border-red-100 bg-red-50 text-red-600 hover:bg-red-100"
          : "border-slate-100 bg-slate-50 text-blue-600 hover:bg-blue-50"
      }`}
    >

      <Icon className="h-6 w-6" />

      <span className="mt-1 text-[10px] font-bold text-slate-600">
        {label}
      </span>

    </Link>
  );
}

function Status({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-2">

      <span className="text-slate-500">
        {label}
      </span>

      <span className="flex items-center gap-1 font-bold text-emerald-600">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        {value}
      </span>

    </div>
  );
}

function MiniStat({ label, value, positive, danger }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">

      <div className="text-[10px] text-slate-500">
        {label}
      </div>

      <div
        className={`mt-1 text-lg font-black ${
          danger
            ? "text-red-600"
            : positive
            ? "text-emerald-600"
            : "text-slate-900"
        }`}
      >
        {value}
      </div>

    </div>
  );
}

export default Dashboard;