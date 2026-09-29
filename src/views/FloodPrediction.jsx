import React, { useState } from "react";
import {
  Cpu,
  Play,
  RotateCcw,
  Sliders,
  AlertTriangle,
  Clock,
  Map,
  Waves,
} from "lucide-react";

import { DAMS_DATA } from "../data/damData";
import { floodPredictionService } from "../services/floodPredictionService";
import { MOCK_SIMULATION_DATA } from "../data/mockSimulationData";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export function FloodPrediction() {
  const [selectedDam, setSelectedDam] = useState(DAMS_DATA[1]);
  const [breachWidth, setBreachWidth] = useState(120);
  const [rainfallIntensity, setRainfallIntensity] = useState(115);
  const [overtoppingHeight, setOvertoppingHeight] = useState(1.8);
  const [isSimulating, setIsSimulating] = useState(false);

  const [simResults, setSimResults] = useState(() =>
    floodPredictionService.runCustomSimulation({
      dam: DAMS_DATA[1],
      breachWidth: 120,
      rainfallIntensity: 115,
      overtoppingHeight: 1.8,
    })
  );

  const handleRunSimulation = () => {
    setIsSimulating(true);

    setTimeout(() => {
      const results = floodPredictionService.runCustomSimulation({
        dam: selectedDam,
        breachWidth,
        rainfallIntensity,
        overtoppingHeight,
      });

      setSimResults(results);
      setIsSimulating(false);
    }, 450);
  };

  const handleReset = () => {
    const width = 120;
    const rainfall = 115;
    const overtopping = 1.8;

    setBreachWidth(width);
    setRainfallIntensity(rainfall);
    setOvertoppingHeight(overtopping);

    setSimResults(
      floodPredictionService.runCustomSimulation({
        dam: selectedDam,
        breachWidth: width,
        rainfallIntensity: rainfall,
        overtoppingHeight: overtopping,
      })
    );
  };

  const hydrograph = [
    { time: "0h", discharge: selectedDam.outflow },
    {
      time: "1h",
      discharge: Math.round(selectedDam.outflow * 1.5),
    },
    {
      time: "2h",
      discharge: Math.round(simResults.peakDischarge * 0.4),
    },
    {
      time: "3h Peak",
      discharge: simResults.peakDischarge,
    },
    {
      time: "4h",
      discharge: Math.round(simResults.peakDischarge * 0.78),
    },
    {
      time: "5h",
      discharge: Math.round(simResults.peakDischarge * 0.52),
    },
    {
      time: "6h",
      discharge: Math.round(simResults.peakDischarge * 0.35),
    },
    {
      time: "8h",
      discharge: Math.round(simResults.peakDischarge * 0.22),
    },
  ];

  return (
    <div className="space-y-6 text-slate-900">

      {/* HEADER */}
      <section className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
              <Cpu className="w-5 h-5 text-blue-600" />
            </div>

            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900">
                AI Dam Breach &amp; Inundation Simulation Engine
              </h1>

              <p className="text-sm text-slate-500 mt-1">
                Physics-based Froehlich breach hydraulics combined with
                Delft3D hydrodynamic wave propagation.
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-sm font-medium hover:bg-slate-50"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>

            <button
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-semibold shadow-sm"
            >
              <Play className="w-4 h-4 fill-current" />
              {isSimulating ? "Simulating..." : "Execute Simulation"}
            </button>
          </div>
        </div>
      </section>

      {/* MAIN AREA */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">

        {/* CONTROLS */}
        <section className="xl:col-span-4 bg-white border border-slate-200 rounded-xl shadow-sm p-5">

          <div className="flex items-center gap-2 pb-4 border-b border-slate-200">
            <Sliders className="w-4 h-4 text-blue-600" />
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Simulation Variables
              </h2>
              <p className="text-xs text-slate-500">
                Configure breach conditions
              </p>
            </div>
          </div>

          <div className="space-y-6 mt-5">

            {/* DAM */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Target Dam Reservoir
              </label>

              <select
                value={selectedDam.id}
                onChange={(e) => {
                  const dam = DAMS_DATA.find(
                    (item) => item.id === e.target.value
                  );
                  if (dam) setSelectedDam(dam);
                }}
                className="w-full h-10 px-3 rounded-lg border border-slate-300 bg-white text-sm text-slate-800 focus:outline-none focus:border-blue-500"
              >
                {DAMS_DATA.map((dam) => (
                  <option key={dam.id} value={dam.id}>
                    {dam.name} ({dam.state}) - {dam.storagePercentage}% Full
                  </option>
                ))}
              </select>
            </div>

            {/* BREACH WIDTH */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs font-semibold text-slate-700">
                  Simulated Breach Width
                </label>
                <span className="text-sm font-bold text-blue-600">
                  {breachWidth} meters
                </span>
              </div>

              <input
                type="range"
                min="30"
                max="300"
                step="10"
                value={breachWidth}
                onChange={(e) => setBreachWidth(Number(e.target.value))}
                className="w-full accent-blue-600"
              />

              <p className="text-xs text-slate-500 mt-2">
                Structural breach or failure span used by the simulation.
              </p>
            </div>

            {/* RAINFALL */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs font-semibold text-slate-700">
                  Catchment Rainfall (12h)
                </label>
                <span className="text-sm font-bold text-blue-600">
                  {rainfallIntensity} mm
                </span>
              </div>

              <input
                type="range"
                min="20"
                max="250"
                step="5"
                value={rainfallIntensity}
                onChange={(e) =>
                  setRainfallIntensity(Number(e.target.value))
                }
                className="w-full accent-blue-600"
              />

              <p className="text-xs text-slate-500 mt-2">
                Rainfall over the reservoir drainage catchment.
              </p>
            </div>

            {/* OVERTOPPING */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-xs font-semibold text-slate-700">
                  Crest Overtopping Height
                </label>
                <span className="text-sm font-bold text-orange-600">
                  {overtoppingHeight} meters
                </span>
              </div>

              <input
                type="range"
                min="0"
                max="4"
                step="0.2"
                value={overtoppingHeight}
                onChange={(e) =>
                  setOvertoppingHeight(Number(e.target.value))
                }
                className="w-full accent-orange-500"
              />

              <p className="text-xs text-slate-500 mt-2">
                Water head above the maximum crest elevation.
              </p>
            </div>

            {/* RESERVOIR STATUS */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <span className="text-xs font-semibold text-slate-600">
                  Reservoir Storage
                </span>

                <span className="text-sm font-bold text-blue-600">
                  {selectedDam.storagePercentage}%
                </span>
              </div>

              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      selectedDam.storagePercentage
                    )}%`,
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <p className="text-[11px] text-slate-500">
                    Water Level
                  </p>
                  <p className="text-sm font-bold text-slate-900 mt-1">
                    {selectedDam.currentWaterLevel} m
                  </p>
                </div>

                <div>
                  <p className="text-[11px] text-slate-500">
                    Current Outflow
                  </p>
                  <p className="text-sm font-bold text-slate-900 mt-1">
                    {selectedDam.outflow} m³/s
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* OUTPUT */}
        <section className="xl:col-span-8 space-y-5">

          {/* KPI CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">

            <div className="bg-white border border-red-200 rounded-xl p-4 shadow-sm">
              <div className="flex justify-between">
                <span className="text-xs text-slate-500">
                  Peak Discharge
                </span>
                <Waves className="w-4 h-4 text-red-500" />
              </div>

              <p className="text-xl font-bold text-red-600 mt-2">
                {simResults.peakDischarge.toLocaleString()}
              </p>

              <p className="text-xs text-slate-500">
                m³/s · Froehlich Qpeak
              </p>
            </div>

            <div className="bg-white border border-orange-200 rounded-xl p-4 shadow-sm">
              <div className="flex justify-between">
                <span className="text-xs text-slate-500">
                  Time to Peak
                </span>
                <Clock className="w-4 h-4 text-orange-500" />
              </div>

              <p className="text-xl font-bold text-orange-600 mt-2">
                {simResults.timeToPeakHours}
              </p>

              <p className="text-xs text-slate-500">
                hours · Breach culmination
              </p>
            </div>

            <div className="bg-white border border-blue-200 rounded-xl p-4 shadow-sm">
              <div className="flex justify-between">
                <span className="text-xs text-slate-500">
                  Inundation Area
                </span>
                <Map className="w-4 h-4 text-blue-600" />
              </div>

              <p className="text-xl font-bold text-blue-600 mt-2">
                {simResults.inundationAreaKm2}
              </p>

              <p className="text-xs text-slate-500">
                km² · Downstream submersion
              </p>
            </div>

            <div className="bg-white border border-amber-200 rounded-xl p-4 shadow-sm">
              <div className="flex justify-between">
                <span className="text-xs text-slate-500">
                  First Town Arrival
                </span>
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              </div>

              <p className="text-xl font-bold text-amber-600 mt-2">
                {simResults.firstSettlementArrivalTimeHours}
              </p>

              <p className="text-xs text-slate-500">
                hours · Wave travel window
              </p>
            </div>
          </div>

          {/* CHART */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">

            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Breach Outflow Wave Hydrograph
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  Delft3D model simulation output
                </p>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-red-50 border border-red-100 text-red-600 text-xs font-semibold">
                Peak {simResults.peakDischarge.toLocaleString()} m³/s
              </span>
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hydrograph}>
                  <defs>
                    <linearGradient
                      id="pravahFloodGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#ef4444"
                        stopOpacity={0.25}
                      />
                      <stop
                        offset="95%"
                        stopColor="#ef4444"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <XAxis
                    dataKey="time"
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    axisLine={{ stroke: "#cbd5e1" }}
                    tickLine={false}
                  />

                  <YAxis
                    tick={{ fill: "#64748b", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) =>
                      value >= 1000
                        ? `${Math.round(value / 1000)}k`
                        : value
                    }
                  />

                  <Tooltip
                    contentStyle={{
                      background: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    formatter={(value) => [
                      `${Number(value).toLocaleString()} m³/s`,
                      "Discharge",
                    ]}
                  />

                  <Area
                    type="monotone"
                    dataKey="discharge"
                    stroke="#ef4444"
                    strokeWidth={2.5}
                    fill="url(#pravahFloodGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>
      </div>

      {/* DOWNSTREAM TABLE */}
      <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

        <div className="p-5">
          <h2 className="text-sm font-bold text-slate-900">
            Downstream Population Settlement Flood Wave Arrival Timeline
          </h2>

          <p className="text-xs text-slate-500 mt-1">
            Estimated flood-wave arrival, depth and evacuation priority.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">

            <thead>
              <tr className="bg-slate-50 border-y border-slate-200">
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">
                  Settlement / Ward
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">
                  River Distance
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">
                  Flood Wave Arrival
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">
                  Est. Peak Depth
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">
                  Population at Risk
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-slate-600">
                  Priority
                </th>
              </tr>
            </thead>

            <tbody>
              {MOCK_SIMULATION_DATA.arrivalTimes.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-5 py-3.5 font-semibold text-slate-900">
                    {item.district}
                  </td>

                  <td className="px-5 py-3.5 text-slate-600">
                    {item.distanceKm} km
                  </td>

                  <td className="px-5 py-3.5 font-semibold text-orange-600">
                    {item.arrivalTimeHours} hours
                  </td>

                  <td className="px-5 py-3.5 font-semibold text-red-600">
                    {item.maxDepthMeters} m
                  </td>

                  <td className="px-5 py-3.5 text-slate-700">
                    {item.population.toLocaleString()} citizens
                  </td>

                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        item.status === "Red Zone"
                          ? "bg-red-50 text-red-700 border border-red-200"
                          : item.status === "Orange Zone"
                          ? "bg-orange-50 text-orange-700 border border-orange-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {item.priority}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </section>

      {/* INFO */}
      <section className="bg-blue-50 border border-blue-100 rounded-xl p-4">
        <div className="flex gap-3">
          <Cpu className="w-5 h-5 text-blue-600 mt-0.5" />

          <div>
            <h3 className="text-sm font-semibold text-blue-900">
              PRAVAH Simulation Engine
            </h3>

            <p className="text-xs text-blue-800 mt-1">
              Adjust reservoir, breach width, catchment rainfall and
              overtopping parameters, then execute the simulation to
              update the predicted flood-wave outputs.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}

export default FloodPrediction;