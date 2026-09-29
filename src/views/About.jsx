import React from "react";
import {
  Shield,
  Award,
  Cpu,
  Waves,
  Globe,
  FileCheck,
  CheckCircle2,
} from "lucide-react";

export function About() {
  const pillars = [
    {
      icon: Waves,
      title: "Hydrodynamic Telemetry Core",
      text: "Ingests water levels, spillway discharge, reservoir storage and dam monitoring information to support real-time flood assessment.",
      color: "blue",
    },
    {
      icon: Cpu,
      title: "Delft3D & SPH Breach Simulation",
      text: "Supports dam-breach and overtopping simulations to estimate flood arrival time, inundation depth and affected areas.",
      color: "indigo",
    },
    {
      icon: Shield,
      title: "Explainable Gemini AI",
      text: "Converts complex hydrological and operational information into understandable risk explanations, alerts and decision-support information.",
      color: "amber",
    },
    {
      icon: Globe,
      title: "Multilingual Accessibility",
      text: "Provides multilingual navigation and voice-based accessibility to help users understand emergency information.",
      color: "emerald",
    },
  ];

  const frameworks = [
    {
      title: "Dam Safety Act 2021",
      text: "Supports emergency action planning, dam monitoring and public risk information.",
    },
    {
      title: "NDMA Guidelines",
      text: "Designed around flood preparedness, evacuation coordination, shelters and disaster response workflows.",
    },
    {
      title: "IMD Weather Data",
      text: "Weather and rainfall information can be used alongside dam telemetry for flood-risk assessment.",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-10">

      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
            <Award className="w-4 h-4" />
            Smart India Hackathon 2026 • SIH26161
          </div>

          <h1 className="mt-5 text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            PRAVAH{" "}
            <span className="text-blue-600 font-medium">प्रवाह</span>
          </h1>

          <p className="mt-2 text-sm sm:text-base font-medium text-blue-700">
            AI Dam Flood Intelligence & Disaster Management Platform
          </p>

          <p className="max-w-3xl mx-auto mt-4 text-sm text-slate-500 leading-6">
            PRAVAH is an integrated platform designed to bring dam monitoring,
            flood prediction, risk assessment, weather information, emergency
            alerts and evacuation support into a unified operational interface.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-slate-200">
          <div className="p-4 text-center border-r border-slate-200">
            <p className="text-xl font-bold text-slate-900">24/7</p>
            <p className="text-xs text-slate-500 mt-1">Monitoring</p>
          </div>

          <div className="p-4 text-center sm:border-r border-slate-200">
            <p className="text-xl font-bold text-slate-900">AI</p>
            <p className="text-xs text-slate-500 mt-1">Risk Analysis</p>
          </div>

          <div className="p-4 text-center border-r border-slate-200">
            <p className="text-xl font-bold text-slate-900">12</p>
            <p className="text-xs text-slate-500 mt-1">Languages</p>
          </div>

          <div className="p-4 text-center">
            <p className="text-xl font-bold text-slate-900">GIS</p>
            <p className="text-xs text-slate-500 mt-1">Map Intelligence</p>
          </div>
        </div>
      </div>

      {/* Core Architecture */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900">
            Core Platform Capabilities
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Major technology and operational components of PRAVAH.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pillars.map((item, index) => {
            const Icon = item.icon;

            const iconStyle = {
              blue: "bg-blue-50 text-blue-600",
              indigo: "bg-indigo-50 text-indigo-600",
              amber: "bg-amber-50 text-amber-600",
              emerald: "bg-emerald-50 text-emerald-600",
            }[item.color];

            return (
              <div
                key={item.title}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4">
                  <div
                    className={`w-10 h-10 shrink-0 rounded-lg flex items-center justify-center ${iconStyle}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-400">
                        0{index + 1}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900">
                        {item.title}
                      </h3>
                    </div>

                    <p className="text-sm text-slate-500 leading-6 mt-2">
                      {item.text}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Architecture Flow */}
      <section className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
        <div className="flex items-center gap-2 mb-5">
          <Cpu className="w-5 h-5 text-blue-600" />
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              PRAVAH Operational Architecture
            </h2>
            <p className="text-xs text-slate-500">
              From monitoring data to emergency response.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {[
            ["01", "Data Sources", "Dam telemetry, weather and GIS data"],
            ["02", "Analysis", "Flood modelling and AI-assisted assessment"],
            ["03", "Risk & Alerts", "Risk classification and emergency alerts"],
            ["04", "Response", "Evacuation, shelters and safe-route support"],
          ].map(([number, title, text], index) => (
            <React.Fragment key={number}>
              <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-blue-600">
                  {number}
                </span>

                <h3 className="text-sm font-bold text-slate-900 mt-2">
                  {title}
                </h3>

                <p className="text-xs text-slate-500 leading-5 mt-1">
                  {text}
                </p>
              </div>

              {index < 3 && (
                <div className="hidden sm:flex items-center justify-center text-slate-300">
                  →
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* Frameworks */}
      <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-blue-600" />
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Institutional & Framework Alignment
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Frameworks referenced in the platform concept.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5">
          {frameworks.map((item) => (
            <div
              key={item.title}
              className="p-4 rounded-lg border border-slate-200 bg-slate-50"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <h3 className="text-sm font-semibold text-slate-900">
                  {item.title}
                </h3>
              </div>

              <p className="text-xs text-slate-500 leading-5 mt-2">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <div className="text-center py-4">
        <p className="text-xs font-medium text-slate-500">
          PRAVAH • Smart India Hackathon 2026 • Problem ID SIH26161
        </p>
        <p className="text-[11px] text-slate-400 mt-1">
          AI-assisted dam flood intelligence and disaster management platform
        </p>
      </div>
    </div>
  );
}

export default About;