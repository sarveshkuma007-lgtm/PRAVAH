import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Activity,
  MapPin,
  Cpu,
  AlertOctagon,
  CloudRain,
  Bell,
  Siren,
  Route,
  Home,
  FileText,
  BarChart3,
  Sliders,
  Users,
  Settings as SettingsIcon,
  Info,
  Smartphone,
} from "lucide-react";

import { useLanguage } from "../context/LanguageContext";
import { useEmergency } from "../context/EmergencyContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export function Sidebar({ isOpen, onClose }) {
  const { t } = useLanguage();
  const { criticalAlertsCount } = useEmergency();
  const { currentUser } = useAuth();
  const { darkMode } = useTheme();

  const navigationItems = [
    {
      to: "/dashboard",
      label: t("dashboard"),
      icon: LayoutDashboard,
      exact: true,
    },
    {
      to: "/dam-monitoring",
      label: t("damMonitoring"),
      icon: Activity,
    },
    {
      to: "/live-map",
      label: t("liveMap"),
      icon: MapPin,
    },
    {
      to: "/flood-prediction",
      label: t("floodPrediction"),
      icon: Cpu,
      badge: "AI",
    },
    {
      to: "/risk-assessment",
      label: t("riskAssessment"),
      icon: AlertOctagon,
    },
    {
      to: "/weather",
      label: t("weather"),
      icon: CloudRain,
    },
    {
      to: "/alerts",
      label: t("alerts"),
      icon: Bell,
      badge:
        criticalAlertsCount > 0
          ? `${criticalAlertsCount} Critical`
          : null,
      badgeColor:
        "bg-red-50 text-red-600 border border-red-200",
    },
    {
      to: "/emergency-response",
      label: t("emergencyResponse"),
      icon: Siren,
      highlight: true,
    },
    {
      to: "/safe-routes",
      label: t("safeRoutes"),
      icon: Route,
    },
    {
      to: "/shelters",
      label: t("shelters"),
      icon: Home,
    },
    {
      to: "/reports",
      label: t("reports"),
      icon: FileText,
    },
    {
      to: "/analytics",
      label: t("analytics"),
      icon: BarChart3,
    },
    {
      to: "/manage-dams",
      label: t("manageDams"),
      icon: Sliders,
    },
    {
      to: "/manage-users",
      label: t("manageUsers"),
      icon: Users,
    },
    {
      to: "/settings",
      label: t("settings"),
      icon: SettingsIcon,
    },
    {
      to: "/about",
      label: t("about"),
      icon: Info,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className={`fixed inset-0 z-40 backdrop-blur-sm lg:hidden ${
            darkMode
              ? "bg-slate-950/80"
              : "bg-slate-900/30"
          }`}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 border-r transition-all duration-200 ease-in-out flex flex-col ${
          isOpen
            ? "translate-x-0"
            : "-translate-x-full"
        } lg:translate-x-0 ${
          darkMode
            ? "bg-slate-900 border-slate-800"
            : "bg-white border-slate-200"
        }`}
      >
        {/* Authority Header */}
        <div
          className={`p-3.5 border-b ${
            darkMode
              ? "border-slate-800 bg-slate-950/40"
              : "border-slate-200 bg-slate-50"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="relative flex w-2 h-2">
              <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-500" />
            </span>

            <span
              className={`text-[11px] font-mono uppercase tracking-wider ${
                darkMode
                  ? "text-slate-400"
                  : "text-slate-500"
              }`}
            >
              National Hydro Telemetry
            </span>
          </div>

          <p
            className={`text-xs font-semibold truncate mt-1 ${
              darkMode
                ? "text-slate-200"
                : "text-slate-800"
            }`}
          >
            {currentUser?.organization ||
              "CWC & NDMA Command"}
          </p>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    onClose();
                  }
                }}
                className={({ isActive }) => {
                  if (isActive) {
                    return `flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg border transition-all ${
                      darkMode
                        ? "bg-blue-500/15 text-blue-300 border-blue-500/30"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                    }`;
                  }

                  if (item.highlight) {
                    return `flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                      darkMode
                        ? "text-red-300 hover:bg-red-950/40 hover:text-red-200"
                        : "text-red-600 hover:bg-red-50 hover:text-red-700"
                    }`;
                  }

                  return `flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-all ${
                    darkMode
                      ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`;
                }}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">
                    {item.label}
                  </span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      item.badgeColor ||
                      (darkMode
                        ? "bg-blue-950 text-blue-300 border border-blue-800"
                        : "bg-blue-50 text-blue-600 border border-blue-200")
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* Bottom Section */}
        <div
          className={`p-3 border-t ${
            darkMode
              ? "border-slate-800 bg-slate-950/60"
              : "border-slate-200 bg-slate-50"
          }`}
        >
          <NavLink
            to="/public"
            className={`flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg text-xs font-semibold border transition-colors ${
              darkMode
                ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
                : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200"
            }`}
          >
            <Smartphone
              className={`w-3.5 h-3.5 ${
                darkMode
                  ? "text-blue-400"
                  : "text-blue-600"
              }`}
            />

            <span>Citizen Mobile Portal</span>
          </NavLink>

          <div
            className={`mt-2 text-[10px] text-center font-mono ${
              darkMode
                ? "text-slate-500"
                : "text-slate-400"
            }`}
          >
            PRAVAH &bull; SIH26161 &bull; 2026
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;