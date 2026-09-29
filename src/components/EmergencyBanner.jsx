import React from "react";
import { Link } from "react-router-dom";
import {
  Siren,
  Shield,
  Waves,
  Volume2,
  VolumeX,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { useEmergency } from "../context/EmergencyContext";
import { useLanguage } from "../context/LanguageContext";

export function EmergencyBanner() {
  const {
    emergencyModeActive,
    criticalAlertsCount,
    audioMuted,
    toggleAudio,
    speechSafetyMode,
    toggleSpeechSafetyMode,
  } = useEmergency();

  const { t } = useLanguage();

  if (!emergencyModeActive && criticalAlertsCount === 0) {
    return null;
  }

  return (
    <div className="sticky top-0 z-[60] border-b border-red-500/50 bg-gradient-to-r from-red-950 via-red-900 to-red-950 text-red-100 shadow-lg shadow-red-950/30">
      <div className="mx-auto flex min-h-[52px] max-w-[1600px] items-center gap-3 px-3 sm:px-5">

        {/* ================= PRAVAH BRANDING ================= */}
        <Link
          to="/dashboard"
          className="flex shrink-0 items-center gap-2.5 border-r border-red-700/60 pr-3 sm:pr-4"
        >
          {/* Blue Flood / Dam Logo */}
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-500/40">
            <div className="absolute inset-0 rounded-xl border-2 border-blue-300/70 animate-ping opacity-40" />

            <div className="relative z-10 flex flex-col items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
              <Waves className="absolute bottom-0.5 h-3 w-5 text-cyan-200" />
            </div>
          </div>

          {/* Animated PRAVAH Name */}
          <div className="leading-none">
            <div className="pravah-glow-logo">
              PRAVAH
            </div>

            <div className="mt-1 text-[8px] font-bold tracking-widest text-blue-200">
              FLOOD INTELLIGENCE
            </div>
          </div>
        </Link>

        {/* ================= EMERGENCY STATUS ================= */}
        <div className="flex min-w-0 flex-1 items-center gap-2">

          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-600/30 ring-1 ring-red-400/50">
            <Siren className="h-4 w-4 animate-pulse text-red-300" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">

              <span className="rounded bg-red-600 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
                {t("dangerAlert")}
              </span>

              <span className="truncate text-[11px] font-semibold text-red-100">
                {criticalAlertsCount} Critical Dam / Flood Bulletins Active
              </span>
            </div>

            <p className="hidden truncate text-[10px] text-red-200/90 md:block">
              High inundation risk detected in Hirakud &amp; Tehri downstream
              basins. Response units on Code Red.
            </p>
          </div>
        </div>

        {/* ================= CONTROLS ================= */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">

          {/* Voice Safety */}
          <button
            onClick={toggleSpeechSafetyMode}
            className={`hidden items-center gap-1.5 rounded border px-2.5 py-1.5 text-[10px] font-bold transition-colors md:flex ${
              speechSafetyMode
                ? "border-amber-400 bg-amber-500 text-slate-950"
                : "border-red-700/60 bg-red-900/60 text-red-200 hover:bg-red-800"
            }`}
            title="Voice Safety Mode"
          >
            <ShieldAlert className="h-3.5 w-3.5" />

            Voice Safety {speechSafetyMode ? "ON" : "OFF"}
          </button>

          {/* Audio */}
          <button
            onClick={toggleAudio}
            className="rounded border border-red-700/60 bg-red-900/60 p-1.5 text-red-200 transition-colors hover:bg-red-800"
            title={audioMuted ? "Unmute Alerts" : "Mute Siren"}
          >
            {audioMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4 animate-pulse text-amber-300" />
            )}
          </button>

          {/* Emergency Response */}
          <Link
            to="/emergency-response"
            className="flex items-center gap-1.5 rounded bg-red-600 px-2.5 py-1.5 text-[10px] font-black text-white shadow-sm transition-colors hover:bg-red-500 sm:px-3"
          >
            <Siren className="h-3.5 w-3.5" />

            <span className="hidden sm:inline">
              {t("emergencyResponse")}
            </span>

            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EmergencyBanner;