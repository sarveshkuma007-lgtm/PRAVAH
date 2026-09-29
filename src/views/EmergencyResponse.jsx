import React, { useState } from "react";
import {
  Siren,
  PhoneCall,
  ShieldAlert,
  Users,
  CheckSquare,
  Truck,
  Volume2,
  AlertTriangle,
  Radio,
  Clock,
} from "lucide-react";
import { useEmergency } from "../context/EmergencyContext";
import {
  speakAlert,
  playEmergencyAlertSound,
} from "../utils/emergencyUtils";

export function EmergencyResponse() {
  const {
    emergencyModeActive,
    toggleEmergencyMode,
    speechSafetyMode,
    toggleSpeechSafetyMode,
  } = useEmergency();

  const [checklist, setChecklist] = useState([
    {
      id: 1,
      text: "Sound riverside siren beacons across Sambalpur & Burla wards",
      done: true,
    },
    {
      id: 2,
      text: "Deploy NDRF 3rd Battalion motorized rescue zodiacs to Low-lying Ward 4",
      done: true,
    },
    {
      id: 3,
      text: "Cut electrical grid feeders to inundated sub-stations to prevent electrocution",
      done: true,
    },
    {
      id: 4,
      text: "Dispatch 24 state transport evacuation buses along NH-53 high ground",
      done: false,
    },
    {
      id: 5,
      text: "Open GM University & Govt High School relief centers with hot meal supplies",
      done: true,
    },
    {
      id: 6,
      text: "Issue radio broadcast in Odia, Hindi, and English every 15 minutes",
      done: false,
    },
  ]);

  const toggleCheck = (id) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item
      )
    );
  };

  const handleTestSiren = () => {
    playEmergencyAlertSound();

    speakAlert(
      "Attention: This is an official emergency alert. High water release detected. Proceed to safe high ground shelters."
    );
  };

  const completedTasks = checklist.filter((item) => item.done).length;
  const progress = Math.round(
    (completedTasks / checklist.length) * 100
  );

  return (
    <div className="space-y-5 text-slate-900">

      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">

          <div>
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-lg ${
                  emergencyModeActive
                    ? "bg-red-100"
                    : "bg-blue-50"
                }`}
              >
                <Siren
                  className={`w-5 h-5 ${
                    emergencyModeActive
                      ? "text-red-600"
                      : "text-blue-600"
                  }`}
                />
              </div>

              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  Emergency Response Operations
                </h1>

                <p className="text-sm text-slate-500 mt-0.5">
                  Incident command, rescue coordination and evacuation
                  operations.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">

            <button
              onClick={handleTestSiren}
              className="flex items-center gap-2 px-3.5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg"
            >
              <Volume2 className="w-4 h-4 text-amber-600" />
              Test Voice Announcement
            </button>

            <button
              onClick={toggleEmergencyMode}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors ${
                emergencyModeActive
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-red-50 border border-red-200 text-red-700 hover:bg-red-100"
              }`}
            >
              <Radio className="w-4 h-4" />
              {emergencyModeActive
                ? "CODE RED ENGAGED"
                : "ENGAGE CODE RED"}
            </button>

          </div>
        </div>
      </div>

      {/* Active Emergency Banner */}
      {emergencyModeActive && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-3">

            <div className="p-2 bg-red-100 rounded-lg">
              <ShieldAlert className="w-5 h-5 text-red-600" />
            </div>

            <div>
              <p className="text-sm font-bold text-red-800">
                Emergency Mode Active
              </p>

              <p className="text-xs text-red-700 mt-0.5">
                Emergency response coordination and alert operations are
                currently enabled.
              </p>
            </div>

          </div>
        </div>
      )}

      {/* Emergency Hotlines */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <PhoneCall className="w-4 h-4 text-slate-600" />

          <h2 className="text-sm font-bold text-slate-800">
            Emergency Communication Lines
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">

          <a
            href="tel:112"
            className="bg-white border border-red-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-medium text-slate-500">
                  National Emergency
                </p>

                <p className="text-2xl font-bold text-red-600 mt-1">
                  112
                </p>
              </div>

              <div className="p-2 bg-red-50 rounded-lg">
                <PhoneCall className="w-5 h-5 text-red-600" />
              </div>

            </div>
          </a>

          <a
            href="tel:1078"
            className="bg-white border border-orange-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-medium text-slate-500">
                  NDRF Disaster Control
                </p>

                <p className="text-2xl font-bold text-orange-600 mt-1">
                  1078
                </p>
              </div>

              <div className="p-2 bg-orange-50 rounded-lg">
                <PhoneCall className="w-5 h-5 text-orange-600" />
              </div>

            </div>
          </a>

          <a
            href="tel:1070"
            className="bg-white border border-amber-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-medium text-slate-500">
                  State Disaster Response
                </p>

                <p className="text-2xl font-bold text-amber-600 mt-1">
                  1070
                </p>
              </div>

              <div className="p-2 bg-amber-50 rounded-lg">
                <PhoneCall className="w-5 h-5 text-amber-600" />
              </div>

            </div>
          </a>

          <a
            href="tel:1077"
            className="bg-white border border-blue-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-medium text-slate-500">
                  District Collectorate
                </p>

                <p className="text-2xl font-bold text-blue-600 mt-1">
                  1077
                </p>
              </div>

              <div className="p-2 bg-blue-50 rounded-lg">
                <PhoneCall className="w-5 h-5 text-blue-600" />
              </div>

            </div>
          </a>

        </div>
      </div>

      {/* Operational Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <Users className="w-5 h-5 text-blue-600 mb-2" />

          <p className="text-xs text-slate-500">
            Response Teams
          </p>

          <p className="text-2xl font-bold text-slate-900 mt-1">
            14
          </p>

          <p className="text-xs text-green-600 mt-1">
            Deployed in field
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <Truck className="w-5 h-5 text-orange-600 mb-2" />

          <p className="text-xs text-slate-500">
            Rescue Personnel
          </p>

          <p className="text-2xl font-bold text-slate-900 mt-1">
            165+
          </p>

          <p className="text-xs text-slate-500 mt-1">
            Across response units
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <ShieldAlert className="w-5 h-5 text-red-600 mb-2" />

          <p className="text-xs text-slate-500">
            Active Operations
          </p>

          <p className="text-2xl font-bold text-slate-900 mt-1">
            4
          </p>

          <p className="text-xs text-red-600 mt-1">
            Priority operations
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <Clock className="w-5 h-5 text-green-600 mb-2" />

          <p className="text-xs text-slate-500">
            SOP Completion
          </p>

          <p className="text-2xl font-bold text-slate-900 mt-1">
            {progress}%
          </p>

          <p className="text-xs text-green-600 mt-1">
            {completedTasks}/{checklist.length} tasks complete
          </p>
        </div>

      </div>

      {/* Main Operations */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

        {/* Response Units */}
        <div className="xl:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm">

          <div className="p-5 border-b border-slate-200 flex items-center justify-between">

            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Disaster Response Units
              </h2>

              <p className="text-xs text-slate-500 mt-1">
                Current field deployment and operational status
              </p>
            </div>

            <span className="px-2.5 py-1 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold rounded-full">
              14 Teams Deployed
            </span>

          </div>

          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-3">

            {[
              {
                unit: "NDRF 3rd Battalion (Team Delta)",
                location: "Sambalpur Riverbank Wards",
                strength: "45 Rescuers • 8 Zodiac Inflatables",
                status: "ACTIVE SEARCH & RESCUE",
              },
              {
                unit: "Odisha Disaster Rapid Action Force (ODRAF)",
                location: "Burla Downstream Lowland",
                strength: "32 Personnel • Tree Cutting Equipment",
                status: "CLEARING EVACUATION ROUTE",
              },
              {
                unit: "Indian Army Engineering Task Force",
                location: "Chiplima Power House Bridge",
                strength: "60 Sapper Engineers • Bailey Bridge Kit",
                status: "FORTIFYING APPROACH",
              },
              {
                unit: "State Fire & Emergency Services",
                location: "Khetrajpur Bus Terminal",
                strength: "28 Officers • 4 Heavy Pumping Units",
                status: "URBAN DEWATERING",
              },
            ].map((unit, index) => (
              <div
                key={index}
                className="border border-slate-200 rounded-lg p-4 hover:border-blue-200 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">

                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      {unit.unit}
                    </h3>

                    <p className="text-xs text-slate-500 mt-1">
                      {unit.location}
                    </p>
                  </div>

                  <span className="shrink-0 px-2 py-1 bg-blue-50 border border-blue-200 text-blue-700 text-[10px] font-semibold rounded">
                    ACTIVE
                  </span>

                </div>

                <p className="text-xs text-slate-500 mt-3">
                  {unit.strength}
                </p>

                <div className="mt-3 pt-3 border-t border-slate-100">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase">
                    Current Task
                  </p>

                  <p className="text-xs font-medium text-slate-700 mt-1">
                    {unit.status}
                  </p>
                </div>
              </div>
            ))}

          </div>

          {/* Evacuation Progress */}
          <div className="px-5 pb-5">

            <div className="border-t border-slate-200 pt-5">

              <div className="flex items-center justify-between mb-4">

                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Urban Ward Evacuation Progress
                  </h3>

                  <p className="text-xs text-slate-500 mt-1">
                    Population relocation progress in low-lying areas
                  </p>
                </div>

              </div>

              <div className="space-y-4">

                <div>
                  <div className="flex justify-between gap-3 mb-1.5">
                    <span className="text-xs font-medium text-slate-700">
                      Ward 3 & 4 — Mandalia Riverbank
                    </span>

                    <span className="text-xs font-semibold text-blue-600">
                      78%
                    </span>
                  </div>

                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: "78%" }}
                    />
                  </div>

                  <p className="text-[11px] text-slate-500 mt-1">
                    3,420 citizens relocated
                  </p>
                </div>

                <div>
                  <div className="flex justify-between gap-3 mb-1.5">
                    <span className="text-xs font-medium text-slate-700">
                      Ward 7 — Khetrajpur Railway Colony
                    </span>

                    <span className="text-xs font-semibold text-orange-600">
                      54%
                    </span>
                  </div>

                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500 rounded-full"
                      style={{ width: "54%" }}
                    />
                  </div>

                  <p className="text-[11px] text-slate-500 mt-1">
                    2,180 citizens relocated
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Checklist */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm">

          <div className="p-5 border-b border-slate-200">

            <div className="flex items-center justify-between">

              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Emergency SOP Checklist
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  Command-level operational checklist
                </p>
              </div>

              <CheckSquare className="w-5 h-5 text-blue-600" />

            </div>

          </div>

          <div className="p-5 space-y-3">

            {checklist.map((item) => (
              <label
                key={item.id}
                className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={() => toggleCheck(item.id)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />

                <span
                  className={`text-xs leading-5 ${
                    item.done
                      ? "text-slate-400 line-through"
                      : "text-slate-700"
                  }`}
                >
                  {item.text}
                </span>
              </label>
            ))}

          </div>

          {/* Progress */}
          <div className="px-5 pb-5">

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">

              <div className="flex justify-between mb-2">
                <span className="text-xs font-semibold text-slate-700">
                  Checklist Progress
                </span>

                <span className="text-xs font-bold text-blue-600">
                  {progress}%
                </span>
              </div>

              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Communication Settings */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div className="flex items-start gap-3">

            <div className="p-2 bg-blue-50 rounded-lg">
              <Volume2 className="w-5 h-5 text-blue-600" />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Emergency Voice Safety Mode
              </h3>

              <p className="text-xs text-slate-500 mt-1">
                Controls voice announcements used for emergency alerts.
              </p>
            </div>

          </div>

          <button
            onClick={toggleSpeechSafetyMode}
            className={`px-4 py-2 rounded-lg text-sm font-semibold border ${
              speechSafetyMode
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-slate-50 border-slate-200 text-slate-600"
            }`}
          >
            {speechSafetyMode ? "Voice Safety Enabled" : "Voice Safety Disabled"}
          </button>

        </div>

      </div>

      {/* Operational Note */}
      <div className="flex gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">

        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />

        <div>
          <p className="text-sm font-semibold text-amber-800">
            Operational Notice
          </p>

          <p className="text-xs text-amber-700 mt-1">
            Emergency response information should be verified with the
            responsible district and disaster-management authorities before
            operational deployment.
          </p>
        </div>

      </div>

    </div>
  );
}

export default EmergencyResponse;