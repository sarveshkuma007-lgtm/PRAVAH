import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ShieldAlert,
  Activity,
  AlertOctagon,
  Cpu,
  Waves,
  ChevronRight,
  MapPin,
  Droplets,
  Gauge,
  CloudRain,
  Radio,
  Wind,
} from "lucide-react";

import { useEmergency } from "../context/EmergencyContext";
import { damService } from "../services/damService";
import { DAMS_DATA } from "../data/damData";
import { AlertCard } from "../components/AlertCard";
import { WeatherWidget } from "../components/WeatherWidget";
import { WaterLevelChart } from "../components/WaterLevelChart";
import { DamHealthCard } from "../components/DamHealthCard";
import { FloodMap } from "../components/FloodMap";

// =====================================================
// INLINE HOOK: useCountUp
// Animates a number from its previous value to a new
// target whenever `target` changes. Used by TelemetryCard.
// =====================================================
function useCountUp(target, duration = 800) {
  const [value, setValue] = useState(0);
  const fromRef = useRef(0);
  const frameRef = useRef(null);
  const startRef = useRef(null);

  useEffect(() => {
    fromRef.current = value;
    startRef.current = null;

    const step = (ts) => {
      if (startRef.current === null) startRef.current = ts;
      const progress = Math.min((ts - startRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(fromRef.current + (target - fromRef.current) * eased));
      if (progress < 1) frameRef.current = requestAnimationFrame(step);
    };

    frameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration]);

  return value;
}

// =====================================================
// INLINE COMPONENT: TelemetryCard
// One KPI tile in the telemetry strip. Severity controls
// border color, glow, and whether it pulses.
// =====================================================
function TelemetryCard({ label, value, unit, icon: Icon, color, severity }) {
  const animatedValue = useCountUp(value);

  const severityBorder =
    severity === "critical"
      ? "border-red-600 shadow-[0_0_18px_-4px_rgba(239,68,68,0.5)]"
      : severity === "warning"
      ? "border-amber-700"
      : "border-[#153452]";

  const barColor =
    severity === "critical"
      ? "from-red-500 to-transparent"
      : severity === "warning"
      ? "from-amber-500 to-transparent"
      : "from-cyan-500/70 to-transparent";

  return (
    <div
      className={`relative border bg-[#07172d] p-3 ${severityBorder} ${
        severity === "critical" ? "animate-pulse" : ""
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[9px] font-bold tracking-wider text-slate-400">
          {label}
        </span>
        <Icon className={`h-4 w-4 ${color}`} />
      </div>

      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-white tabular-nums">
          {animatedValue}
        </span>
        <span className={`text-[10px] font-bold ${color}`}>{unit}</span>
      </div>

      <div className={`mt-2 h-0.5 bg-gradient-to-r ${barColor}`} />
    </div>
  );
}

// =====================================================
// MAIN COMPONENT: Dashboard
// =====================================================
export function Dashboard() {
  const {
    alerts,
    activeAlertsCount,
    criticalAlertsCount,
    acknowledgeAlert,
  } = useEmergency();

  const [selectedDam, setSelectedDam] = useState(DAMS_DATA[1]);
  const [hydroData, setHydroData] = useState([]);

  useEffect(() => {
    if (selectedDam) {
      const trend = damService.getWaterLevelTrend(selectedDam.id, 24);
      setHydroData(trend);
    }
  }, [selectedDam]);

  const criticalDams = DAMS_DATA.filter(
    (dam) =>
      dam.riskLevel === "CRITICAL" || dam.riskLevel === "HIGH"
  );

  const avgStorage = Math.round(
    DAMS_DATA.reduce(
      (total, dam) => total + dam.storagePercentage,
      0
    ) / DAMS_DATA.length
  );

  const telemetryItems = [
    {
      label: "MONITORED DAMS",
      value: DAMS_DATA.length,
      unit: "ACTIVE",
      icon: Radio,
      color: "text-cyan-400",
      severity: "ok",
    },
    {
      label: "CRITICAL / HIGH",
      value: criticalDams.length,
      unit: "DAMS",
      icon: AlertOctagon,
      color: "text-red-400",
      severity: criticalDams.length > 0 ? "critical" : "ok",
    },
    {
      label: "RESERVOIR STORAGE",
      value: avgStorage,
      unit: "%",
      icon: Waves,
      color: "text-amber-400",
      severity: avgStorage > 85 ? "warning" : "ok",
    },
    {
      label: "ACTIVE BULLETINS",
      value: activeAlertsCount,
      unit: "ALERTS",
      icon: ShieldAlert,
      color: "text-red-400",
      severity: activeAlertsCount > 0 ? "warning" : "ok",
    },
  ];

  return (
    <div className="min-h-full space-y-4 bg-[#020817] pb-8">

      {/* COMMAND CENTER HEADER */}
      <header className="rounded-lg border border-cyan-950 bg-[#07172d] px-4 py-4 shadow-lg shadow-cyan-950/10">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded border border-cyan-700 bg-cyan-950/50">
              <Droplets className="h-6 w-6 text-cyan-400" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg font-bold tracking-wide text-white md:text-xl">
                  PRAVAH
                </h1>

                <span className="border border-cyan-800 bg-cyan-950 px-2 py-0.5 text-[10px] font-bold tracking-wider text-cyan-400">
                  HYDRO INTELLIGENCE
                </span>

                <span className="flex items-center gap-1 border border-emerald-800 bg-emerald-950/50 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  SYSTEM ONLINE
                </span>
              </div>

              <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-slate-400">
                National Dam Flood Monitoring & Response Platform
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="border border-slate-700 bg-slate-950 px-3 py-2 text-[10px] font-mono text-slate-400">
              DATA MODE: DEMONSTRATION
            </div>

            <Link
              to="/flood-prediction"
              className="flex items-center gap-2 border border-cyan-800 bg-cyan-950/60 px-3 py-2 text-xs font-semibold text-cyan-300 transition hover:bg-cyan-900"
            >
              <Cpu className="h-3.5 w-3.5" />
              Breach Simulation
            </Link>

            <Link
              to="/emergency-response"
              className="flex items-center gap-2 border border-red-700 bg-red-700 px-3 py-2 text-xs font-bold text-white transition hover:bg-red-600"
            >
              <ShieldAlert className="h-3.5 w-3.5" />
              Emergency
            </Link>
          </div>
        </div>
      </header>

      {/* TELEMETRY STRIP */}
      <section className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        {telemetryItems.map((item) => (
          <TelemetryCard key={item.label} {...item} />
        ))}
      </section>

      {/* MAIN COMMAND CENTER GRID */}
      <section className="grid grid-cols-1 gap-3 xl:grid-cols-12">

        {/* LEFT TELEMETRY PANEL */}
        <aside className="space-y-3 xl:col-span-3">

          <div className="border border-[#153452] bg-[#07172d]">
            <div className="flex items-center gap-2 border-b border-[#153452] bg-[#0b2340] px-3 py-2">
              <Gauge className="h-4 w-4 text-cyan-400" />
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-cyan-200">
                Dam Monitoring
              </h2>
            </div>

            <div className="space-y-2 p-3">
              <label className="text-[10px] uppercase tracking-wider text-slate-400">
                Selected Reservoir
              </label>

              <select
                value={selectedDam?.id || ""}
                onChange={(event) => {
                  const dam = DAMS_DATA.find(
                    (item) => item.id === event.target.value
                  );

                  if (dam) {
                    setSelectedDam(dam);
                  }
                }}
                className="w-full border border-cyan-900 bg-[#020817] px-2 py-2 text-xs text-slate-200 outline-none focus:border-cyan-400"
              >
                {DAMS_DATA.map((dam) => (
                  <option key={dam.id} value={dam.id}>
                    {dam.name}
                  </option>
                ))}
              </select>

              <div className="grid grid-cols-2 gap-2">
                <div className="border border-slate-800 bg-[#020817] p-2">
                  <p className="text-[9px] text-slate-500">LOCATION</p>
                  <p className="mt-1 truncate text-[11px] font-semibold text-slate-200">
                    {selectedDam?.state || "India"}
                  </p>
                </div>

                <div className="border border-slate-800 bg-[#020817] p-2">
                  <p className="text-[9px] text-slate-500">RISK LEVEL</p>
                  <p
                    className={`mt-1 text-[11px] font-bold ${
                      selectedDam?.riskLevel === "CRITICAL"
                        ? "text-red-400"
                        : selectedDam?.riskLevel === "HIGH"
                          ? "text-amber-400"
                          : "text-emerald-400"
                    }`}
                  >
                    {selectedDam?.riskLevel || "UNKNOWN"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-[#153452] bg-[#07172d]">
            <div className="flex items-center gap-2 border-b border-[#153452] bg-[#0b2340] px-3 py-2">
              <Activity className="h-4 w-4 text-cyan-400" />
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-cyan-200">
                Network Status
              </h2>
            </div>

            <div className="space-y-3 p-3">
              {[
                ["Telemetry Network", "ONLINE"],
                ["GIS Services", "CONNECTED"],
                ["Weather Service", "AVAILABLE"],
                ["AI Risk Engine", "READY"],
              ].map(([label, status]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2 last:border-0 last:pb-0"
                >
                  <span className="text-[10px] text-slate-400">
                    {label}
                  </span>

                  <span className="flex items-center gap-1.5 text-[9px] font-bold text-emerald-400">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    </span>
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </aside>

        {/* CENTRAL GIS MAP */}
        <div className="space-y-2 xl:col-span-6">
          <div className="flex items-center justify-between border border-[#153452] bg-[#07172d] px-3 py-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-cyan-400" />

              <div>
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-cyan-200">
                  Live Flood GIS Map
                </h2>

                <p className="text-[9px] text-slate-500">
                  Reservoirs / Flood Zones / Downstream Risk
                </p>
              </div>
            </div>

            <Link
              to="/live-map"
              className="flex items-center gap-1 text-[10px] font-semibold text-cyan-400 hover:text-cyan-200"
            >
              Expand
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="overflow-hidden border border-cyan-900 bg-[#020817] p-1">
            <FloodMap
              selectedDam={selectedDam}
              height="520px"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 border border-[#153452] bg-[#07172d] px-3 py-2 text-[9px] text-slate-400">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              DAMS
            </span>

            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              BREACH ZONES
            </span>

            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              SAFE AREAS
            </span>

            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              HIGH RISK
            </span>
          </div>
        </div>

        {/* RIGHT WEATHER AND ALERT PANEL */}
        <aside className="space-y-3 xl:col-span-3">

          <div className="border border-[#153452] bg-[#07172d]">
            <div className="flex items-center gap-2 border-b border-[#153452] bg-[#0b2340] px-3 py-2">
              <CloudRain className="h-4 w-4 text-cyan-400" />
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-cyan-200">
                Catchment Weather
              </h2>
            </div>

            <div className="p-2">
              <WeatherWidget
                damName={selectedDam?.name || "Hirakud Dam"}
              />
            </div>
          </div>

          <div className="border border-red-950 bg-[#07172d]">
            <div className="flex items-center justify-between border-b border-red-950 bg-red-950/40 px-3 py-2">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-red-400" />
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-red-300">
                  Alert Center
                </h2>
              </div>

              <span
                className={`text-[10px] font-bold text-red-400 ${
                  criticalAlertsCount > 0 ? "animate-pulse" : ""
                }`}
              >
                {criticalAlertsCount} CRITICAL
              </span>
            </div>

            <div className="max-h-[260px] space-y-2 overflow-y-auto p-2">
              {alerts.length > 0 ? (
                alerts.slice(0, 3).map((alert) => (
                  <AlertCard
                    key={alert.id}
                    alert={alert}
                    onAcknowledge={acknowledgeAlert}
                    compact={true}
                  />
                ))
              ) : (
                <div className="p-4 text-center text-[10px] text-slate-500">
                  No active alerts
                </div>
              )}
            </div>

            <Link
              to="/alerts"
              className="flex items-center justify-center gap-1 border-t border-red-950 px-3 py-2 text-[10px] font-semibold text-cyan-400 hover:bg-cyan-950/30"
            >
              View All Alerts
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

        </aside>
      </section>

      {/* HYDROLOGICAL TELEMETRY CHART */}
      <section className="border border-[#153452] bg-[#07172d]">
        <div className="flex flex-col gap-2 border-b border-[#153452] bg-[#0b2340] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-cyan-400" />

            <div>
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-cyan-200">
                Reservoir Hydrograph & Telemetry
              </h2>

              <p className="text-[9px] text-slate-500">
                24-hour water-level monitoring
              </p>
            </div>
          </div>

          <span className="text-[10px] font-semibold text-cyan-400">
            {selectedDam?.name}
          </span>
        </div>

        <div className="p-3">
          <WaterLevelChart
            data={hydroData}
            dam={selectedDam}
          />
        </div>
      </section>

      {/* DAM FLEET STATUS */}
      <section className="space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-200">
              National Dam Fleet
            </h2>

            <p className="mt-1 text-[10px] text-slate-500">
              Reservoir health and operational monitoring
            </p>
          </div>

          <Link
            to="/dam-monitoring"
            className="flex items-center gap-1 text-[10px] font-semibold text-cyan-400 hover:text-cyan-200"
          >
            View All Dams
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {DAMS_DATA.slice(0, 4).map((dam) => (
            <DamHealthCard
              key={dam.id}
              dam={dam}
            />
          ))}
        </div>
      </section>

    </div>
  );
}

export default Dashboard;
