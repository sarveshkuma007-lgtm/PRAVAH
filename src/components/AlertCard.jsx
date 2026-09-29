import React, { useState } from "react";
import {
  AlertTriangle,
  Siren,
  Volume2,
  CheckCircle2,
  Clock,
  MapPin,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { speakAlert } from "../utils/emergencyUtils";
import { formatTimeAgo } from "../utils/helpers";
import { useLanguage } from "../context/LanguageContext";

export function AlertCard({ alert, onAcknowledge, compact = false }) {
  const { activeLangObj } = useLanguage();
  const [expanded, setExpanded] = useState(false);

  const styles = {
    CRITICAL: {
      border: "border-red-500/50 hover:border-red-400",
      bg: "bg-red-950/20",
      badge: "bg-red-600 text-white",
      icon: Siren,
      iconColor: "text-red-400",
    },
    HIGH: {
      border: "border-orange-500/50 hover:border-orange-400",
      bg: "bg-orange-950/20",
      badge: "bg-orange-500 text-slate-950 font-bold",
      icon: AlertTriangle,
      iconColor: "text-orange-400",
    },
    MODERATE: {
      border: "border-amber-500/40 hover:border-amber-400",
      bg: "bg-amber-950/15",
      badge: "bg-amber-500/20 text-amber-300 border border-amber-500/40",
      icon: AlertTriangle,
      iconColor: "text-amber-400",
    },
    DEFAULT: {
      border: "border-sky-500/30 hover:border-sky-400",
      bg: "bg-sky-950/15",
      badge: "bg-sky-500/20 text-sky-300 border border-sky-500/40",
      icon: AlertTriangle,
      iconColor: "text-sky-400",
    },
  };

  const style = styles[alert.severity?.toUpperCase()] || styles.DEFAULT;
  const Icon = style.icon;
  const isExpanded = compact ? expanded : true;

  const toggleExpanded = () => {
    if (compact) setExpanded((current) => !current);
  };

  const handleReadAloud = (event) => {
    event.stopPropagation();
    speakAlert(
      `${alert.severity} ALERT: ${alert.title}. ${alert.description}. Recommended action: ${alert.recommendedAction || ""}`,
      activeLangObj?.speechCode || "en-IN"
    );
  };

  const handleAcknowledge = (event) => {
    event.stopPropagation();
    onAcknowledge?.(alert.id);
  };

  return (
    <article
      role={compact ? "button" : undefined}
      tabIndex={compact ? 0 : undefined}
      aria-expanded={compact ? expanded : undefined}
      onClick={toggleExpanded}
      onKeyDown={(event) => {
        if (compact && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          toggleExpanded();
        }
      }}
      className={`rounded-lg border p-3 ${style.border} ${style.bg} shadow-md shadow-slate-950/40 transition-all duration-200 ${
        compact
          ? "cursor-pointer focus:outline-none focus:ring-1 focus:ring-cyan-400/70"
          : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span
            className={`shrink-0 rounded px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider ${style.badge}`}
          >
            {alert.severity}
          </span>
          <span className="truncate text-[10px] font-mono text-slate-400">
            {alert.category}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-1 text-[10px] font-mono text-slate-500">
          <Clock className="h-3 w-3" />
          <span>{formatTimeAgo(alert.timestamp)}</span>
        </div>
      </div>

      <div className="mt-2 flex items-start gap-2">
        <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${style.iconColor}`} />
        <h3 className="min-w-0 flex-1 text-xs font-bold leading-5 text-slate-100">
          {alert.title}
        </h3>

        {compact &&
          (isExpanded ? (
            <ChevronUp className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
          ) : (
            <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
          ))}
      </div>

      <p
        className={`mt-1 text-[11px] leading-5 text-slate-300 ${
          !isExpanded ? "line-clamp-2" : ""
        }`}
      >
        {alert.description}
      </p>

      {isExpanded && (
        <>
          {alert.location && (
            <div className="mt-2 flex items-center gap-1.5 text-[10px] font-mono text-cyan-300/90">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{alert.location}</span>
            </div>
          )}

          {alert.recommendedAction && (
            <div className="mt-3 flex items-start gap-2 rounded-md border border-slate-800 bg-slate-950/60 p-2 text-[10px] text-amber-200/90">
              <span className="shrink-0 text-[9px] font-bold uppercase tracking-wider text-amber-400">
                Action:
              </span>
              <span>{alert.recommendedAction}</span>
            </div>
          )}
        </>
      )}

      <div className="mt-3 flex items-center justify-between border-t border-slate-800/80 pt-2">
        <button
          type="button"
          onClick={handleReadAloud}
          className="flex items-center gap-1 text-[10px] text-slate-400 transition-colors hover:text-cyan-300"
        >
          <Volume2 className="h-3.5 w-3.5" />
          <span>Listen</span>
        </button>

        <div className="flex items-center gap-2">
          {compact && (
            <span className="text-[9px] text-slate-500">
              {isExpanded ? "Collapse" : "Expand"}
            </span>
          )}

          {onAcknowledge && alert.status !== "ACKNOWLEDGED" && (
            <button
              type="button"
              onClick={handleAcknowledge}
              className="flex items-center gap-1 rounded border border-slate-700 bg-slate-800 px-2 py-1 text-[10px] font-medium text-slate-200 transition-colors hover:bg-slate-700"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>Acknowledge</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default AlertCard;
