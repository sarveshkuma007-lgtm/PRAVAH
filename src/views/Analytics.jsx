import React from "react";
import {
  BarChart3,
  TrendingUp,
  Waves,
  Droplet,
  AlertTriangle,
  Database,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { DAMS_DATA } from "../data/damData";

export function Analytics() {
  const barData = DAMS_DATA.map((dam) => ({
    name: dam.name.replace(" Dam", ""),
    storage: dam.storagePercentage,
    inflow: dam.inflow,
    outflow: dam.outflow,
  }));

  const riskDistribution = [
    {
      name: "Critical",
      value: DAMS_DATA.filter(
        (d) => d.riskLevel === "CRITICAL"
      ).length,
      color: "#dc2626",
    },
    {
      name: "High",
      value: DAMS_DATA.filter(
        (d) => d.riskLevel === "HIGH"
      ).length,
      color: "#ea580c",
    },
    {
      name: "Moderate",
      value: DAMS_DATA.filter(
        (d) => d.riskLevel === "MODERATE"
      ).length,
      color: "#d97706",
    },
    {
      name: "Normal",
      value: DAMS_DATA.filter(
        (d) => d.riskLevel === "NORMAL"
      ).length,
      color: "#16a34a",
    },
  ];

  const totalDams = DAMS_DATA.length;

  const criticalDams = DAMS_DATA.filter(
    (d) => d.riskLevel === "CRITICAL"
  ).length;

  const highRiskDams = DAMS_DATA.filter(
    (d) => d.riskLevel === "HIGH"
  ).length;

  const averageStorage =
    totalDams > 0
      ? Math.round(
          DAMS_DATA.reduce(
            (sum, dam) => sum + dam.storagePercentage,
            0
          ) / totalDams
        )
      : 0;

  const totalInflow = DAMS_DATA.reduce(
    (sum, dam) => sum + dam.inflow,
    0
  );

  const totalOutflow = DAMS_DATA.reduce(
    (sum, dam) => sum + dam.outflow,
    0
  );

  return (
    <div className="space-y-5 text-slate-900">

      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">

        <div className="flex items-start gap-3">

          <div className="p-2.5 bg-blue-50 rounded-lg">
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Hydrological Analytics
            </h1>

            <p className="text-sm text-slate-500 mt-1">
              Reservoir storage, inflow/outflow and risk-level
              analytics across monitored dams.
            </p>
          </div>

        </div>

      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <Database className="w-5 h-5 text-blue-600 mb-2" />

          <p className="text-xs text-slate-500">
            Monitored Dams
          </p>

          <p className="text-2xl font-bold text-slate-900 mt-1">
            {totalDams}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <Droplet className="w-5 h-5 text-blue-600 mb-2" />

          <p className="text-xs text-slate-500">
            Avg. Storage
          </p>

          <p className="text-2xl font-bold text-slate-900 mt-1">
            {averageStorage}%
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <TrendingUp className="w-5 h-5 text-orange-600 mb-2" />

          <p className="text-xs text-slate-500">
            Total Inflow
          </p>

          <p className="text-2xl font-bold text-slate-900 mt-1">
            {totalInflow.toLocaleString()}
          </p>

          <p className="text-[10px] text-slate-400">
            m³/s
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <Waves className="w-5 h-5 text-cyan-600 mb-2" />

          <p className="text-xs text-slate-500">
            Total Discharge
          </p>

          <p className="text-2xl font-bold text-slate-900 mt-1">
            {totalOutflow.toLocaleString()}
          </p>

          <p className="text-[10px] text-slate-400">
            m³/s
          </p>
        </div>

        <div className="bg-white border border-red-200 rounded-xl p-4 shadow-sm">
          <AlertTriangle className="w-5 h-5 text-red-600 mb-2" />

          <p className="text-xs text-slate-500">
            Critical / High
          </p>

          <p className="text-2xl font-bold text-red-600 mt-1">
            {criticalDams + highRiskDams}
          </p>

          <p className="text-[10px] text-slate-400">
            dams requiring attention
          </p>
        </div>

      </div>

      {/* Storage Chart */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm">

        <div className="px-5 py-4 border-b border-slate-200">

          <h2 className="text-sm font-bold text-slate-900">
            Reservoir Storage Utilization
          </h2>

          <p className="text-xs text-slate-500 mt-1">
            Current storage as a percentage of Full Reservoir Level.
          </p>

        </div>

        <div className="p-5">

          <div className="h-72 w-full">

            <ResponsiveContainer width="100%" height="100%">

              <BarChart
                data={barData}
                margin={{
                  top: 10,
                  right: 10,
                  left: 0,
                  bottom: 5,
                }}
              >

                <XAxis
                  dataKey="name"
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
                  unit="%"
                  domain={[0, 100]}
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
                  dataKey="storage"
                  name="Storage %"
                  fill="#2563eb"
                  radius={[5, 5, 0, 0]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

      {/* Inflow / Outflow + Risk */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

        {/* Inflow vs Outflow */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm">

          <div className="px-5 py-4 border-b border-slate-200">

            <h2 className="text-sm font-bold text-slate-900">
              Inflow vs Sluice Discharge
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Comparison of incoming and outgoing reservoir flow.
            </p>

          </div>

          <div className="p-5">

            <div className="h-64 w-full">

              <ResponsiveContainer width="100%" height="100%">

                <BarChart
                  data={barData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 0,
                    bottom: 5,
                  }}
                >

                  <XAxis
                    dataKey="name"
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
                    unit=" m³/s"
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderColor: "#e2e8f0",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />

                  <Legend
                    wrapperStyle={{
                      fontSize: "11px",
                    }}
                  />

                  <Bar
                    dataKey="inflow"
                    name="Inflow"
                    fill="#2563eb"
                    radius={[5, 5, 0, 0]}
                  />

                  <Bar
                    dataKey="outflow"
                    name="Discharge"
                    fill="#ea580c"
                    radius={[5, 5, 0, 0]}
                  />

                </BarChart>

              </ResponsiveContainer>

            </div>

          </div>

        </div>

        {/* Risk Distribution */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm">

          <div className="px-5 py-4 border-b border-slate-200">

            <h2 className="text-sm font-bold text-slate-900">
              Dam Alert-Level Distribution
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Distribution of monitored dams by current risk level.
            </p>

          </div>

          <div className="p-5">

            <div className="h-64 w-full">

              <ResponsiveContainer width="100%" height="100%">

                <PieChart>

                  <Pie
                    data={riskDistribution}
                    cx="50%"
                    cy="45%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >

                    {riskDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                      />
                    ))}

                  </Pie>

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderColor: "#e2e8f0",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />

                  <Legend
                    verticalAlign="bottom"
                    wrapperStyle={{
                      fontSize: "11px",
                    }}
                  />

                </PieChart>

              </ResponsiveContainer>

            </div>

          </div>

        </div>

      </div>

      {/* Data Note */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">

        <Database className="w-5 h-5 text-blue-600 shrink-0" />

        <div>

          <p className="text-sm font-semibold text-blue-800">
            Analytics Data
          </p>

          <p className="text-xs text-blue-700 mt-1 leading-5">
            Charts are generated from the dam monitoring dataset currently
            available in PRAVAH. Values should be interpreted alongside
            live telemetry and official operational advisories.
          </p>

        </div>

      </div>

    </div>
  );
}

export default Analytics;