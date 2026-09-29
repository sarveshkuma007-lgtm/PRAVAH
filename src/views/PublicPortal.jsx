import React from "react";
import { Link } from "react-router-dom";
import {
  ShieldAlert,
  ShieldCheck,
  MapPin,
  Home,
  PhoneCall,
  Volume2,
  Navigation,
  AlertTriangle,
} from "lucide-react";
import { useLocation } from "../hooks/useLocation";
import { useEmergency } from "../context/EmergencyContext";
import { useLanguage } from "../context/LanguageContext";
import { LiveLocationMap } from "../components/LiveLocationMap";
import { speakAlert } from "../utils/emergencyUtils";

export function PublicPortal() {
  const { location, nearestDam, nearestShelter } = useLocation();
  const { criticalAlertsCount } = useEmergency();
  const { activeLangObj } = useLanguage();

  const isCriticalZone =
    nearestDam && nearestDam.riskLevel === "CRITICAL";

  const handleReadSafetyAdvice = () => {
    speakAlert(
      "Public Safety Advisory: You are located near " +
        (location.name || "the river basin") +
        ". Hirakud Dam is discharging flood water. If you are in a low-lying riverside area, move immediately to " +
        (nearestShelter?.name || "the nearest high ground shelter") +
        ". Follow the designated routes. Call 112 for rescue.",
      activeLangObj?.speechCode || "en-IN"
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-10">

      {/* Safety Status */}
      <section
        className={`rounded-xl border shadow-sm overflow-hidden ${
          isCriticalZone
            ? "border-red-200 bg-red-50"
            : "border-green-200 bg-white"
        }`}
      >
        <div className="p-5 sm:p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">

            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  isCriticalZone
                    ? "bg-red-100 text-red-600"
                    : "bg-green-100 text-green-600"
                }`}
              >
                {isCriticalZone ? (
                  <ShieldAlert className="w-7 h-7" />
                ) : (
                  <ShieldCheck className="w-7 h-7" />
                )}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Local Proximity Safety Assessment
                </p>

                <h1
                  className={`text-xl sm:text-2xl font-bold mt-1 ${
                    isCriticalZone ? "text-red-800" : "text-slate-900"
                  }`}
                >
                  {isCriticalZone
                    ? "Flood Surge Warning in Effect"
                    : "Monitoring Normal Inflow"}
                </h1>

                <p className="text-sm text-slate-500 mt-1">
                  {criticalAlertsCount > 0
                    ? `${criticalAlertsCount} critical alert${
                        criticalAlertsCount > 1 ? "s" : ""
                      } currently active`
                    : "No critical local alert currently reported"}
                </p>
              </div>
            </div>

            <button
              onClick={handleReadSafetyAdvice}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              <Volume2 className="w-4 h-4" />
              Read Safety Advice
            </button>
          </div>

          {/* Local information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Monitored River Basin
              </p>

              <div className="flex items-center gap-2 mt-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-slate-900">
                  {location?.name || "Live GPS Location"}
                </span>
              </div>

              {nearestDam && (
                <p className="text-xs text-slate-500 mt-2">
                  Nearest dam:{" "}
                  <span className="font-semibold text-slate-700">
                    {nearestDam.name}
                  </span>{" "}
                  • Risk:{" "}
                  <span
                    className={
                      nearestDam.riskLevel === "CRITICAL"
                        ? "text-red-600 font-semibold"
                        : "text-slate-700 font-semibold"
                    }
                  >
                    {nearestDam.riskLevel}
                  </span>
                </p>
              )}
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-4">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                Nearest High-Ground Shelter
              </p>

              <div className="flex items-center gap-2 mt-2">
                <Home className="w-4 h-4 text-green-600" />
                <span className="text-sm font-semibold text-slate-900">
                  {nearestShelter?.name || "Govt High School Shelter"}
                </span>
              </div>

              <p className="text-xs text-slate-500 mt-2">
                Elevation: +
                {nearestShelter?.elevationMeters || 45}m •{" "}
                {nearestShelter?.distanceKm || 1.8} km away
              </p>
            </div>
          </div>

          {/* Emergency actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
            <a
              href="tel:112"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-sm transition-colors"
            >
              <PhoneCall className="w-4 h-4" />
              SOS • Dial 112
            </a>

            <a
              href="tel:1078"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold text-sm transition-colors"
            >
              <PhoneCall className="w-4 h-4" />
              NDRF Hotline 1078
            </a>

            <Link
              to="/safe-routes"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-colors"
            >
              <Navigation className="w-4 h-4" />
              Find Safe Route
            </Link>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">
            Safe Evacuation Corridor
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Route from your monitored location toward the nearest available
            shelter.
          </p>
        </div>

        <div className="p-3">
          <LiveLocationMap height="360px" />
        </div>
      </section>

      {/* Safety instructions */}
      <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Dam Flood Safety Protocol
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Practical guidance for flood and dam-discharge situations.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5">

          {/* Before */}
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
            <span className="text-xs font-bold text-blue-700 uppercase">
              01 • Before / Alert Issued
            </span>

            <ul className="mt-3 space-y-2 text-sm text-slate-600 list-disc pl-4 leading-5">
              <li>
                Keep your phone charged and prepare essential medicines,
                identification and drinking water.
              </li>
              <li>
                Move livestock and pets toward safer elevated areas.
              </li>
              <li>
                Monitor official emergency alerts and local authorities.
              </li>
            </ul>
          </div>

          {/* During */}
          <div className="p-4 rounded-lg bg-orange-50 border border-orange-100">
            <span className="text-xs font-bold text-orange-700 uppercase">
              02 • During Flood Surge
            </span>

            <ul className="mt-3 space-y-2 text-sm text-slate-600 list-disc pl-4 leading-5">
              <li>
                Move to higher ground when an evacuation warning is issued.
              </li>
              <li>
                Never walk or drive through fast-moving flood water.
              </li>
              <li>
                Follow designated evacuation routes and emergency instructions.
              </li>
            </ul>
          </div>

          {/* Relief */}
          <div className="p-4 rounded-lg bg-green-50 border border-green-100">
            <span className="text-xs font-bold text-green-700 uppercase">
              03 • At Relief Center
            </span>

            <ul className="mt-3 space-y-2 text-sm text-slate-600 list-disc pl-4 leading-5">
              <li>
                Register with the relief-center or district administration.
              </li>
              <li>
                Use drinking water supplied or approved by authorities.
              </li>
              <li>
                Return only after the competent authorities issue an all-clear.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Emergency contact strip */}
      <div className="bg-slate-900 rounded-xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-white">
              Emergency assistance
            </p>
            <p className="text-xs text-slate-400 mt-1">
              For immediate life-threatening emergencies, contact the relevant
              emergency services.
            </p>
          </div>

          <a
            href="tel:112"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold"
          >
            <PhoneCall className="w-4 h-4" />
            112 Emergency
          </a>
        </div>
      </div>

    </div>
  );
}

export default PublicPortal;