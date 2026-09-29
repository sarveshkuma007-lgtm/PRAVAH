import React, { useState } from "react";
import {
  AlertOctagon,
  Sparkles,
  BrainCircuit,
  ShieldAlert,
  Activity,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

import { DAMS_DATA } from "../data/damData";
import { geminiService } from "../services/geminiService";
import { getRiskColorClass } from "../utils/helpers";

export function RiskAssessment() {
  const [selectedDam, setSelectedDam] = useState(DAMS_DATA[1]);
  const [aiReport, setAiReport] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = async () => {
    setIsGenerating(true);

    try {
      const report = await geminiService.analyzeRisk(
        selectedDam,
        {
          rainfall24h: 124.6,
          forecast: "Heavy Continuous Runoff",
        },
        {
          terrain: "Steep river basin with low-lying urban delta",
        }
      );

      setAiReport(report);
    } catch (error) {
      console.error(error);
      setAiReport(
        "Unable to generate the AI audit at this time. Please verify the Gemini API connection."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const riskFactors = [
    {
      name: "Storage vs Rule Curve",
      score: selectedDam.storagePercentage >= 90 ? 94 : 76,
      status: selectedDam.storagePercentage >= 90 ? "CRITICAL" : "HIGH",
      desc:
        "Water level is within 0.35m of the emergency crest overtopping threshold.",
    },
    {
      name: "Catchment Inflow Rate",
      score: 88,
      status: "HIGH",
      desc:
        "Monsoon runoff exceeding 4,800 cumecs continuously for 18 hours.",
    },
    {
      name: "Sluice Gate Aperture Capacity",
      score: 65,
      status: "MODERATE",
      desc:
        "24 of 64 gates operational; maximum discharge regulated by downstream bridge clearance.",
    },
    {
      name: "Structural Piezometric Pore Pressure",
      score: 42,
      status: "NORMAL",
      desc:
        "Sensors at chainage 4+200 indicate stable pore pressure at 0.38 MPa.",
    },
    {
      name: "Downstream Urban Vulnerability",
      score: 91,
      status: "CRITICAL",
      desc:
        "Over 82,000 residents situated within the 4-hour flood arrival perimeter.",
    },
  ];

  const riskScore =
    selectedDam.riskLevel === "CRITICAL"
      ? "92.4"
      : selectedDam.riskLevel === "HIGH"
      ? "78.6"
      : "38.2";

  return (
    <div className="space-y-6 text-slate-900">

      {/* HEADER */}
      <section className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center">
              <AlertOctagon className="w-5 h-5 text-red-600" />
            </div>

            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900">
                Explainable AI Dam Risk &amp; Vulnerability Assessment
              </h1>

              <p className="text-sm text-slate-500 mt-1">
                Multi-criteria hydrological risk assessment and AI-assisted
                decision support.
              </p>
            </div>

          </div>

          {/* DAM SELECTOR */}
          <div className="flex items-center gap-2">

            <span className="text-xs font-semibold text-slate-600">
              Dam:
            </span>

            <select
              value={selectedDam.id}
              onChange={(e) => {
                const dam = DAMS_DATA.find(
                  (item) => item.id === e.target.value
                );

                if (dam) {
                  setSelectedDam(dam);
                  setAiReport("");
                }
              }}
              className="h-10 bg-white border border-slate-300 text-slate-800 text-sm rounded-lg px-3 focus:outline-none focus:border-blue-500"
            >
              {DAMS_DATA.map((dam) => (
                <option key={dam.id} value={dam.id}>
                  {dam.name} - {dam.riskLevel}
                </option>
              ))}
            </select>

          </div>
        </div>
      </section>


      {/* TOP SECTION */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* RISK SCORE */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase">
                Composite Risk Rating
              </p>

              <h2 className="text-lg font-bold text-slate-900 mt-1">
                {selectedDam.name}
              </h2>
            </div>

            <span
              className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                selectedDam.riskLevel === "CRITICAL"
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : selectedDam.riskLevel === "HIGH"
                  ? "bg-orange-50 text-orange-700 border border-orange-200"
                  : "bg-green-50 text-green-700 border border-green-200"
              }`}
            >
              {selectedDam.riskLevel}
            </span>

          </div>


          <div className="mt-5 rounded-xl bg-slate-50 border border-slate-200 p-6 text-center">

            <div className="text-5xl font-bold text-slate-900">
              {riskScore}
            </div>

            <p className="text-xs text-slate-500 mt-2">
              Risk Score / 100
            </p>

            <div className="mt-5 h-2 bg-slate-200 rounded-full overflow-hidden">

              <div
                className={`h-full rounded-full ${
                  selectedDam.riskLevel === "CRITICAL"
                    ? "bg-red-500"
                    : selectedDam.riskLevel === "HIGH"
                    ? "bg-orange-500"
                    : "bg-green-500"
                }`}
                style={{
                  width: `${riskScore}%`,
                }}
              />

            </div>

            <p className="text-xs text-slate-600 mt-4">
              High inundation probability if inflow sustains
              for the next 6 hours.
            </p>

          </div>


          <button
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="
              w-full
              mt-4
              flex
              items-center
              justify-center
              gap-2
              py-2.5
              px-4
              rounded-lg
              bg-blue-600
              hover:bg-blue-700
              disabled:bg-blue-300
              text-white
              text-sm
              font-semibold
              transition
            "
          >
            <Sparkles className="w-4 h-4" />

            {isGenerating
              ? "Generating AI Audit..."
              : "Generate AI Hydrological Audit"}
          </button>

        </div>


        {/* AI REPORT */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm p-5 flex flex-col">

          <div className="flex items-center justify-between pb-3 border-b border-slate-200">

            <div className="flex items-center gap-2">

              <BrainCircuit className="w-5 h-5 text-blue-600" />

              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Explainable AI Diagnostics &amp; Decision Support
                </h2>

                <p className="text-xs text-slate-500 mt-0.5">
                  Hydrological analysis generated from current dam conditions.
                </p>
              </div>

            </div>

            <span className="px-2.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold">
              AI Analysis
            </span>

          </div>


          <div className="flex-1 mt-4">

            {aiReport ? (
              <div className="
                bg-slate-50
                border
                border-slate-200
                rounded-lg
                p-4
                text-sm
                text-slate-700
                whitespace-pre-wrap
                leading-relaxed
                max-h-80
                overflow-y-auto
              ">
                {aiReport}
              </div>
            ) : (
              <div className="
                min-h-64
                flex
                flex-col
                items-center
                justify-center
                text-center
                bg-slate-50
                border
                border-dashed
                border-slate-300
                rounded-lg
                p-6
              ">

                <BrainCircuit className="w-10 h-10 text-slate-300 mb-3" />

                <h3 className="text-sm font-semibold text-slate-700">
                  AI diagnostic report not generated
                </h3>

                <p className="text-xs text-slate-500 mt-2 max-w-md">
                  Click "Generate AI Hydrological Audit" to analyze
                  {` ${selectedDam.name}`} using the configured AI service.
                </p>

              </div>
            )}

          </div>


          <div className="pt-3 mt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">

            <span>
              Assessment standard: CWC Dam Safety Guidelines
            </span>

            <span className="font-semibold text-blue-600">
              Confidence: 96.2%
            </span>

          </div>

        </div>

      </section>


      {/* RISK FACTORS */}
      <section className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">

        <div className="flex items-center gap-2 mb-5">

          <Activity className="w-5 h-5 text-blue-600" />

          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Multi-Parameter Risk Factor Breakdown
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Current contribution of major hydrological and vulnerability
              indicators.
            </p>
          </div>

        </div>


        <div className="space-y-3">

          {riskFactors.map((factor, index) => (

            <div
              key={index}
              className="
                rounded-lg
                border
                border-slate-200
                bg-white
                p-4
                hover:bg-slate-50
                transition
              "
            >

              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">

                <div className="flex items-center gap-3">

                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      factor.status === "CRITICAL"
                        ? "bg-red-50"
                        : factor.status === "HIGH"
                        ? "bg-orange-50"
                        : factor.status === "MODERATE"
                        ? "bg-amber-50"
                        : "bg-green-50"
                    }`}
                  >

                    {factor.status === "CRITICAL" ? (
                      <ShieldAlert className="w-4 h-4 text-red-600" />
                    ) : factor.status === "HIGH" ? (
                      <AlertTriangle className="w-4 h-4 text-orange-600" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    )}

                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      {factor.name}
                    </h3>

                    <p className="text-xs text-slate-500 mt-1">
                      {factor.desc}
                    </p>
                  </div>

                </div>


                <span
                  className={`self-start md:self-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                    factor.status === "CRITICAL"
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : factor.status === "HIGH"
                      ? "bg-orange-50 text-orange-700 border border-orange-200"
                      : factor.status === "MODERATE"
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : "bg-green-50 text-green-700 border border-green-200"
                  }`}
                >
                  {factor.score} / 100 · {factor.status}
                </span>

              </div>


              <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">

                <div
                  className={`h-full rounded-full ${
                    factor.score >= 80
                      ? "bg-red-500"
                      : factor.score >= 60
                      ? "bg-orange-500"
                      : "bg-green-500"
                  }`}
                  style={{
                    width: `${factor.score}%`,
                  }}
                />

              </div>

            </div>

          ))}

        </div>

      </section>


      {/* OPERATIONAL SUMMARY */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">

          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-600" />

            <span className="text-xs font-semibold text-slate-600">
              Current Risk Level
            </span>
          </div>

          <p className="text-lg font-bold text-slate-900 mt-2">
            {selectedDam.riskLevel}
          </p>

          <p className="text-xs text-slate-500 mt-1">
            Based on current reservoir and downstream conditions.
          </p>

        </div>


        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">

          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" />

            <span className="text-xs font-semibold text-slate-600">
              Storage Level
            </span>
          </div>

          <p className="text-lg font-bold text-slate-900 mt-2">
            {selectedDam.storagePercentage}%
          </p>

          <p className="text-xs text-slate-500 mt-1">
            Current reservoir storage utilization.
          </p>

        </div>


        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">

          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />

            <span className="text-xs font-semibold text-slate-600">
              Assessment Status
            </span>
          </div>

          <p className="text-lg font-bold text-slate-900 mt-2">
            Monitoring Active
          </p>

          <p className="text-xs text-slate-500 mt-1">
            Risk indicators are available for operational review.
          </p>

        </div>

      </section>

    </div>
  );
}

export default RiskAssessment;