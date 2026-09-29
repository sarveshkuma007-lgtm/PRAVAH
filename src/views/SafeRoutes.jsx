import React from "react";
import {
  Route,
  Navigation,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Volume2,
  MapPin,
  Clock,
} from "lucide-react";
import { LiveLocationMap } from "../components/LiveLocationMap";
import { useLocation } from "../hooks/useLocation";
import { speakAlert } from "../utils/emergencyUtils";

export function SafeRoutes() {
  const { location, nearestShelter } = useLocation();

  const handleReadDirections = () => {
    speakAlert(
      `Evacuation guidance from your location to ${
        nearestShelter?.name || "the nearest shelter"
      }: Head East onto High Canal Road away from the river bank. Follow the green emergency signs for 1.8 kilometers toward the high ground elevation. Do not attempt to cross submerged culverts.`
    );
  };

  const routeSteps = [
    {
      step: "1",
      text: "Depart your current location and proceed Eastward away from the Mahanadi riverside embankment.",
      dist: "300 meters",
    },
    {
      step: "2",
      text: "Turn LEFT onto High Ridge Canal Bypass Road (NH-53 elevated viaduct). Do NOT use underpasses.",
      dist: "800 meters",
    },
    {
      step: "3",
      text: "Follow the green emergency guidance signboards past the civil hospital.",
      dist: "500 meters",
    },
    {
      step: "4",
      text: `Arrive at ${
        nearestShelter?.name || "the designated relief shelter"
      } and check in with the district relief desk.`,
      dist: "200 meters",
    },
  ];

  return (
    <div className="space-y-5 text-slate-900">

      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          <div className="flex items-start gap-3">

            <div className="p-2.5 bg-green-50 rounded-lg">
              <Route className="w-5 h-5 text-green-600" />
            </div>

            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Safe Evacuation Routes
              </h1>

              <p className="text-sm text-slate-500 mt-1">
                High-ground navigation and flood-safe evacuation corridors.
              </p>
            </div>

          </div>

          <button
            onClick={handleReadDirections}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm"
          >
            <Volume2 className="w-4 h-4" />
            Voice Route Instructions
          </button>

        </div>

      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <MapPin className="w-5 h-5 text-blue-600 mb-2" />

          <p className="text-xs text-slate-500">
            Current Location
          </p>

          <p className="text-sm font-semibold text-slate-900 mt-1">
            {location ? "Location detected" : "Detecting location..."}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <ShieldCheck className="w-5 h-5 text-green-600 mb-2" />

          <p className="text-xs text-slate-500">
            Route Status
          </p>

          <p className="text-sm font-semibold text-green-700 mt-1">
            Flood Resilient
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <Navigation className="w-5 h-5 text-blue-600 mb-2" />

          <p className="text-xs text-slate-500">
            Destination
          </p>

          <p className="text-sm font-semibold text-slate-900 mt-1 truncate">
            {nearestShelter?.name || "Relief Shelter"}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <Clock className="w-5 h-5 text-orange-600 mb-2" />

          <p className="text-xs text-slate-500">
            Route Elevation
          </p>

          <p className="text-sm font-semibold text-orange-700 mt-1">
            +45m High Ground
          </p>
        </div>

      </div>

      {/* Live Map */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">

          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Live Evacuation Map
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Current location, safe corridors and nearby shelter guidance.
            </p>
          </div>

          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold rounded-full">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            Route Active
          </span>

        </div>

        <div className="p-3">
          <LiveLocationMap height="450px" />
        </div>

      </div>

      {/* Route + Hazards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Turn by Turn */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm">

          <div className="p-5 border-b border-slate-200">

            <div className="flex items-center justify-between gap-3">

              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Primary Safe Route
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  Destination:{" "}
                  <span className="font-medium text-slate-700">
                    {nearestShelter?.name || "Relief Shelter"}
                  </span>
                </p>
              </div>

              <span className="px-2.5 py-1 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold rounded-full whitespace-nowrap">
                +45m Elevation
              </span>

            </div>

          </div>

          <div className="p-5 space-y-3">

            {routeSteps.map((step) => (
              <div
                key={step.step}
                className="flex items-start gap-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >

                <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-bold text-xs flex items-center justify-center shrink-0">
                  {step.step}
                </div>

                <div className="flex-1">

                  <p className="text-sm text-slate-700 leading-5">
                    {step.text}
                  </p>

                  <div className="flex items-center gap-1.5 mt-2">
                    <Navigation className="w-3.5 h-3.5 text-slate-400" />

                    <span className="text-xs text-slate-500">
                      {step.dist}
                    </span>
                  </div>

                </div>

                <ArrowRight className="w-4 h-4 text-slate-300 mt-1 shrink-0" />

              </div>
            ))}

          </div>

        </div>

        {/* Hazard Panel */}
        <div className="bg-white border border-red-200 rounded-xl shadow-sm">

          <div className="p-5 border-b border-red-100">

            <div className="flex items-center gap-2">

              <div className="p-2 bg-red-50 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>

              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Hazard Alerts
                </h2>

                <p className="text-xs text-slate-500 mt-1">
                  Blocked or unsafe corridors
                </p>
              </div>

            </div>

          </div>

          <div className="p-5 space-y-3">

            <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg">

              <p className="text-sm font-semibold text-red-800">
                Old Mahanadi Bridge Causeway
              </p>

              <p className="text-xs text-red-700 mt-1.5 leading-5">
                Submerged under approximately 1.4m of turbulent water.
                Avoid the crossing.
              </p>

              <span className="inline-block mt-2 px-2 py-1 bg-red-100 text-red-700 text-[10px] font-semibold rounded">
                CLOSED
              </span>

            </div>

            <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg">

              <p className="text-sm font-semibold text-red-800">
                Ring Road Railway Underpass
              </p>

              <p className="text-xs text-red-700 mt-1.5 leading-5">
                Waterlogged to approximately 2.2m depth. Do not enter
                the underpass.
              </p>

              <span className="inline-block mt-2 px-2 py-1 bg-red-100 text-red-700 text-[10px] font-semibold rounded">
                CLOSED
              </span>

            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs text-amber-800">
                Follow official evacuation signage and do not attempt to
                cross submerged roads or culverts.
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* Safety Notice */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">

        <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />

        <div>
          <p className="text-sm font-semibold text-blue-800">
            Evacuation Safety Guidance
          </p>

          <p className="text-xs text-blue-700 mt-1 leading-5">
            Stay on designated high-ground routes, follow emergency
            personnel instructions and avoid floodwater whenever possible.
            Route conditions may change during an active flood event.
          </p>
        </div>

      </div>

    </div>
  );
}

export default SafeRoutes;