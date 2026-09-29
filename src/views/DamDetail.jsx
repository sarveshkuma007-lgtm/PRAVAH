import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Activity,
  ArrowLeft,
  Cpu,
  Sliders,
  Waves,
  Sparkles,
  Gauge,
} from "lucide-react";
import { DAMS_DATA } from "../data/damData";
import { damService } from "../services/damService";
import { geminiService } from "../services/geminiService";
import { WaterLevelChart } from "../components/WaterLevelChart";
import { FloodMap } from "../components/FloodMap";
import { getRiskColorClass } from "../utils/helpers";

export function DamDetail() {
  const { id } = useParams();

  const [dam, setDam] = useState(null);
  const [hydroData, setHydroData] = useState([]);
  const [aiReport, setAiReport] = useState("");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [activeGates, setActiveGates] = useState(24);

  useEffect(() => {
    const found =
      DAMS_DATA.find((d) => d.id === id) || DAMS_DATA[0];

    setDam(found);
    setActiveGates(found.gatesOpen);

    const trend = damService.getWaterLevelTrend(
      found.id,
      24
    );

    setHydroData(trend);
  }, [id]);

  if (!dam) return null;

  const handleGenerateAiReport = async () => {
    setIsGeneratingAi(true);

    try {
      const report = await geminiService.analyzeRisk(
        dam,
        {},
        {}
      );

      setAiReport(report);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const gateDischarge = Math.round(
    activeGates *
      (dam.outflow / Math.max(1, dam.gatesOpen))
  );

  const levelBuffer =
    Math.round(
      (dam.dangerLevel - dam.currentWaterLevel) * 100
    ) / 100;

  return (
    <div className="space-y-6 pb-8">

      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

          <div>
            <Link
              to="/dam-monitoring"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 mb-3"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Dam Monitoring
            </Link>

            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900">
                {dam.name}
              </h1>

              <span
                className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${getRiskColorClass(
                  dam.riskLevel
                )}`}
              >
                {dam.riskLevel}
              </span>
            </div>

            <p className="text-sm text-slate-500 mt-1">
              {dam.river} Basin • {dam.state}, India
            </p>

            <p className="text-xs text-slate-400 mt-1">
              CWC Code:{" "}
              <span className="font-medium text-slate-600">
                {dam.cwcCode}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleGenerateAiReport}
              disabled={isGeneratingAi}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              {isGeneratingAi
                ? "Generating..."
                : "AI Safety Audit"}
            </button>

            <Link
              to="/flood-prediction"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              <Cpu className="w-4 h-4" />
              Simulate Breach
            </Link>
          </div>
        </div>
      </div>

      {/* AI report */}
      {aiReport && (
        <section className="bg-white border border-blue-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 bg-blue-50 border-b border-blue-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />

            <div>
              <h2 className="text-sm font-bold text-blue-900">
                AI Hydrological Safety Analysis
              </h2>
              <p className="text-xs text-blue-700 mt-0.5">
                Generated from the selected dam telemetry.
              </p>
            </div>
          </div>

          <div className="p-5 text-sm text-slate-600 leading-6 whitespace-pre-wrap">
            {aiReport}
          </div>
        </section>
      )}

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-slate-500">
            Current Water Level
          </p>

          <p className="text-2xl font-bold text-slate-900 mt-1">
            {dam.currentWaterLevel}
            <span className="text-sm font-medium text-slate-400 ml-1">
              m
            </span>
          </p>

          <p className="text-xs text-slate-500 mt-2">
            Danger mark:{" "}
            <span className="font-semibold text-red-600">
              {dam.dangerLevel} m
            </span>
          </p>

          <p className="text-[11px] text-slate-400 mt-1">
            Buffer: {levelBuffer} m
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-slate-500">
            Storage Utilization
          </p>

          <p className="text-2xl font-bold text-blue-600 mt-1">
            {dam.storagePercentage}%
          </p>

          <div className="h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full"
              style={{
                width: `${Math.min(
                  dam.storagePercentage,
                  100
                )}%`,
              }}
            />
          </div>

          <p className="text-[11px] text-slate-400 mt-2">
            Capacity: {dam.capacity} MCM
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-slate-500">
            Current Inflow
          </p>

          <p className="text-2xl font-bold text-blue-600 mt-1">
            {dam.inflow}
          </p>

          <p className="text-xs text-slate-400 mt-1">
            cubic metres / second
          </p>

          <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-500">
            <Waves className="w-3.5 h-3.5 text-blue-500" />
            Catchment inflow
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-slate-500">
            Spillway Outflow
          </p>

          <p className="text-2xl font-bold text-orange-600 mt-1">
            {dam.outflow}
          </p>

          <p className="text-xs text-slate-400 mt-1">
            cubic metres / second
          </p>

          <p className="text-xs text-slate-500 mt-3">
            Gates open:{" "}
            <span className="font-semibold text-slate-700">
              {activeGates}/{dam.totalGates}
            </span>
          </p>
        </div>
      </div>

      {/* Chart + gate control */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        <section className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />

                <div>
                  <h2 className="font-semibold text-slate-900">
                    Inflow vs Outflow Hydrograph
                  </h2>

                  <p className="text-xs text-slate-500 mt-1">
                    24-hour monitoring trend
                  </p>
                </div>
              </div>

              <span className="text-xs text-slate-400">
                Hourly log
              </span>
            </div>
          </div>

          <div className="p-4">
            <WaterLevelChart
              data={hydroData}
              dam={dam}
            />
          </div>
        </section>

        {/* Gate control */}
        <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-blue-600" />

              <div>
                <h2 className="font-semibold text-slate-900">
                  Sluice Gate Status
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  Operational test control
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 space-y-5">

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-600">
                  Gates Open
                </span>

                <span className="text-sm font-bold text-blue-600">
                  {activeGates} / {dam.totalGates}
                </span>
              </div>

              <input
                type="range"
                min={0}
                max={dam.totalGates}
                value={activeGates}
                onChange={(e) =>
                  setActiveGates(Number(e.target.value))
                }
                className="w-full accent-blue-600"
              />
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">
                  Estimated discharge
                </span>

                <span className="font-semibold text-slate-800">
                  {gateDischarge} cumecs
                </span>
              </div>

              <div className="flex justify-between text-xs">
                <span className="text-slate-500">
                  Rule curve safe limit
                </span>

                <span className="font-semibold text-green-600">
                  4,200 cumecs
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <Gauge className="w-4 h-4 text-blue-600" />

                <h3 className="text-sm font-semibold text-slate-800">
                  Structural Telemetry
                </h3>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between gap-3">
                  <span className="text-slate-500">
                    Crest piezometer
                  </span>
                  <span className="font-semibold text-green-600">
                    0.38 MPa • Normal
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span className="text-slate-500">
                    Foundation seepage
                  </span>
                  <span className="font-semibold text-amber-600">
                    14.2 L/min • Elevated
                  </span>
                </div>

                <div className="flex justify-between gap-3">
                  <span className="text-slate-500">
                    Seismic accelerometer
                  </span>
                  <span className="font-semibold text-green-600">
                    0.012g • Quiet
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Map */}
      <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200">
          <h2 className="font-semibold text-slate-900">
            Basin Location & Downstream Flood Channel
          </h2>

          <p className="text-xs text-slate-500 mt-1">
            Geographic context for {dam.name} and its downstream basin.
          </p>
        </div>

        <div className="p-3">
          <FloodMap
            selectedDam={dam}
            center={[dam.lat, dam.lng]}
            zoom={10}
            height="360px"
          />
        </div>
      </section>
    </div>
  );
}

export default DamDetail;