import React from "react";
import { Sparkles } from "lucide-react";
import { useEmergency } from "../context/EmergencyContext";

export function FloatingAIButton({ onClick, isOpen }) {
  const {
    emergencyModeActive,
    criticalAlertsCount,
  } = useEmergency();

  const emergencyActive =
    emergencyModeActive || criticalAlertsCount > 0;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center group">
      {/* Tooltip */}
      <div className="mr-3 px-3 py-2 rounded-lg bg-slate-900 text-cyan-300 text-xs font-semibold border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl whitespace-nowrap hidden sm:block">
        PRAVAH AI Flood Companion
      </div>

      {/* AI Button */}
      <button
        onClick={onClick}
        aria-label="Open PRAVAH AI Assistant"
        title="PRAVAH AI Flood Companion"
        className={`relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 ${
          isOpen
            ? "bg-blue-600 text-white ring-4 ring-blue-300/50 rotate-90 focus:ring-blue-500"
            : emergencyActive
            ? "bg-red-600 text-white ring-4 ring-red-300/40 animate-pulse shadow-red-900/40 focus:ring-red-500"
            : "bg-blue-600 hover:bg-blue-700 text-white ring-4 ring-blue-200/40 hover:ring-blue-300/60 hover:scale-105 focus:ring-blue-500"
        }`}
      >
        <Sparkles
          className={`w-6 h-6 ${
            isOpen ? "" : "animate-pulse"
          }`}
        />

        {/* Emergency indicator */}
        {emergencyActive && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />

            <span className="relative inline-flex rounded-full h-5 w-5 bg-red-600 border-2 border-white text-[10px] font-bold text-white items-center justify-center">
              !
            </span>
          </span>
        )}
      </button>
    </div>
  );
}

export default FloatingAIButton;