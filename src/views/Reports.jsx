import React, { useState } from "react";
import {
  FileText,
  Printer,
  Calendar,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Download,
} from "lucide-react";
import { DAMS_DATA } from "../data/damData";

export function Reports() {
  const [selectedDam, setSelectedDam] = useState(DAMS_DATA[1]);
  const [reportDate, setReportDate] = useState("2026-09-13");

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-5 text-slate-900">

      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          <div className="flex items-start gap-3">

            <div className="p-2.5 bg-blue-50 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>

            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Hydrological Compliance & Safety Reports
              </h1>

              <p className="text-sm text-slate-500 mt-1">
                Reservoir telemetry, rule-curve monitoring and
                hydrological audit summaries.
              </p>
            </div>

          </div>

          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm"
          >
            <Printer className="w-4 h-4" />
            Print Official Bulletin
          </button>

        </div>

      </div>

      {/* Report Controls */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">

        <div className="flex flex-col sm:flex-row sm:items-center gap-4">

          <div className="flex flex-col gap-1.5">

            <label className="text-xs font-semibold text-slate-600">
              Dam Facility
            </label>

            <select
              value={selectedDam.id}
              onChange={(e) => {
                const dam = DAMS_DATA.find(
                  (item) => item.id === e.target.value
                );

                if (dam) {
                  setSelectedDam(dam);
                }
              }}
              className="min-w-[240px] bg-white border border-slate-300 text-slate-700 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
            >
              {DAMS_DATA.map((dam) => (
                <option key={dam.id} value={dam.id}>
                  {dam.name} ({dam.state})
                </option>
              ))}
            </select>

          </div>

          <div className="flex flex-col gap-1.5">

            <label className="text-xs font-semibold text-slate-600">
              Report Date
            </label>

            <div className="relative">

              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />

              <input
                type="date"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
                className="bg-white border border-slate-300 text-slate-700 text-sm rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              />

            </div>

          </div>

        </div>

      </div>

      {/* Report Document */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

        {/* Document Header */}
        <div className="p-6 border-b border-slate-200">

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

            <div className="flex items-start gap-3">

              <div className="p-2 bg-blue-50 rounded-lg">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>

              <div>

                <h2 className="text-base font-bold text-slate-900">
                  CENTRAL WATER COMMISSION
                </h2>

                <p className="text-xs font-semibold text-blue-700 mt-1">
                  PRAVAH DISASTER COMMAND
                </p>

                <p className="text-xs text-slate-500 mt-2">
                  Daily Hydrological Telemetry & Spillway Surge Audit Report
                </p>

              </div>

            </div>

            <div className="text-left sm:text-right text-xs text-slate-500">

              <p>
                Document No:{" "}
                <span className="font-semibold text-slate-700">
                  CWC-HYD-2026-0913
                </span>
              </p>

              <p className="mt-1">
                Date:{" "}
                <span className="font-semibold text-slate-700">
                  {reportDate}
                </span>{" "}
                08:00 IST
              </p>

            </div>

          </div>

        </div>

        <div className="p-6 space-y-7">

          {/* Executive Summary */}
          <section>

            <div className="flex items-center gap-2 mb-3">

              <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 text-xs font-bold flex items-center justify-center">
                1
              </div>

              <h3 className="text-sm font-bold text-slate-900">
                Executive Telemetric Summary
              </h3>

            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">

              <p className="text-sm text-slate-600 leading-6">
                The reservoir water level for{" "}
                <strong className="text-slate-900">
                  {selectedDam.name}
                </strong>{" "}
                ({selectedDam.river} River, {selectedDam.state}) is
                measured at{" "}
                <strong className="text-blue-700">
                  {selectedDam.currentWaterLevel} meters
                </strong>
                , representing{" "}
                <strong className="text-orange-600">
                  {selectedDam.storagePercentage}%
                </strong>{" "}
                of the Full Reservoir Level (FRL{" "}
                {selectedDam.fullReservoirLevel}m).
              </p>

              <p className="text-sm text-slate-600 leading-6 mt-2">
                Incoming flood discharge currently stands at{" "}
                <strong className="text-slate-900">
                  {selectedDam.inflow} cumecs
                </strong>{" "}
                with an authorized spillway discharge of{" "}
                <strong className="text-slate-900">
                  {selectedDam.outflow} cumecs
                </strong>{" "}
                through{" "}
                <strong className="text-slate-900">
                  {selectedDam.gatesOpen}
                </strong>{" "}
                sluice gates.
              </p>

            </div>

          </section>

          {/* Hydrological Parameters */}
          <section>

            <div className="flex items-center gap-2 mb-3">

              <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 text-xs font-bold flex items-center justify-center">
                2
              </div>

              <h3 className="text-sm font-bold text-slate-900">
                Hydrodynamic Parameters & Thresholds
              </h3>

            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-lg">

              <table className="w-full text-left text-sm">

                <thead className="bg-slate-50 border-b border-slate-200">

                  <tr>
                    <th className="px-4 py-3 font-semibold text-slate-600">
                      Telemetry Parameter
                    </th>

                    <th className="px-4 py-3 font-semibold text-slate-600">
                      Recorded Value
                    </th>

                    <th className="px-4 py-3 font-semibold text-slate-600">
                      Safe Rule Limit
                    </th>

                    <th className="px-4 py-3 font-semibold text-slate-600">
                      Status
                    </th>
                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  <tr>
                    <td className="px-4 py-3 text-slate-700">
                      Reservoir Water Elevation
                    </td>

                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {selectedDam.currentWaterLevel} m
                    </td>

                    <td className="px-4 py-3 text-slate-500">
                      Danger: {selectedDam.dangerLevel} m
                    </td>

                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded-full text-xs font-semibold">
                        <AlertTriangle className="w-3 h-3" />
                        Warning
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="px-4 py-3 text-slate-700">
                      Live Storage Ratio
                    </td>

                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {selectedDam.storagePercentage}%
                    </td>

                    <td className="px-4 py-3 text-slate-500">
                      Rule Curve Max: 90.0%
                    </td>

                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-red-50 border border-red-200 text-red-700 rounded-full text-xs font-semibold">
                        Elevated
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="px-4 py-3 text-slate-700">
                      Discharge Surge Rate
                    </td>

                    <td className="px-4 py-3 font-semibold text-slate-900">
                      {selectedDam.outflow} m³/s
                    </td>

                    <td className="px-4 py-3 text-slate-500">
                      Channel Capacity: 4,800 m³/s
                    </td>

                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-green-50 border border-green-200 text-green-700 rounded-full text-xs font-semibold">
                        <CheckCircle2 className="w-3 h-3" />
                        Controlled
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="px-4 py-3 text-slate-700">
                      Piezometer Pore Pressure
                    </td>

                    <td className="px-4 py-3 font-semibold text-slate-900">
                      0.38 MPa
                    </td>

                    <td className="px-4 py-3 text-slate-500">
                      Design Max: 0.65 MPa
                    </td>

                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-green-50 border border-green-200 text-green-700 rounded-full text-xs font-semibold">
                        <CheckCircle2 className="w-3 h-3" />
                        Safe
                      </span>
                    </td>
                  </tr>

                </tbody>

              </table>

            </div>

          </section>

          {/* Compliance Summary */}
          <section>

            <div className="flex items-center gap-2 mb-3">

              <div className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 text-xs font-bold flex items-center justify-center">
                3
              </div>

              <h3 className="text-sm font-bold text-slate-900">
                Compliance Summary
              </h3>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-xs text-green-700 font-medium">
                  Controlled Parameters
                </p>

                <p className="text-2xl font-bold text-green-800 mt-1">
                  2
                </p>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs text-amber-700 font-medium">
                  Warning Parameters
                </p>

                <p className="text-2xl font-bold text-amber-800 mt-1">
                  1
                </p>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs text-red-700 font-medium">
                  Elevated Parameters
                </p>

                <p className="text-2xl font-bold text-red-800 mt-1">
                  1
                </p>
              </div>

            </div>

          </section>

          {/* Sign Off */}
          <div className="pt-5 border-t border-slate-200 flex flex-col md:flex-row md:items-end md:justify-between gap-5">

            <div>
              <p className="text-xs text-slate-500">
                Certified by
              </p>

              <p className="text-sm font-semibold text-slate-900 mt-1">
                Chief Hydrological Engineer
              </p>

              <p className="text-xs text-slate-500 mt-0.5">
                Central Water Commission (CWC) Command
              </p>
            </div>

            <div className="md:text-right">

              <p className="text-xs font-semibold text-blue-600">
                PRAVAH SYSTEM AUTOMATED DIGEST
              </p>

              <p className="text-[10px] text-slate-400 mt-1">
                Verified with SHA-256 Hash: 9b82c3...f4a1
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* Footer Notice */}
      <div className="flex items-start gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">

        <FileText className="w-5 h-5 text-slate-500 shrink-0" />

        <div>
          <p className="text-sm font-semibold text-slate-800">
            Report Information
          </p>

          <p className="text-xs text-slate-500 mt-1 leading-5">
            This report is generated from the PRAVAH monitoring interface.
            Verify operational values with the responsible authority before
            using them for field decisions.
          </p>
        </div>

      </div>

    </div>
  );
}

export default Reports;