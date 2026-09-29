import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  Bell,
  Search,
  Sparkles,
  Shield,
  Siren,
  Globe,
  User,
  LogOut,
  ChevronDown,
  Eye,
  Sun,
  Moon,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useEmergency } from "../context/EmergencyContext";
import { useTheme } from "../context/ThemeContext";
import { USER_ROLES } from "../utils/constants";

export function Navbar({ onToggleSidebar, onOpenAI }) {
  const { currentUser, logout, switchRole } = useAuth();
  const {
    currentLanguage,
    setLanguage,
    languages,
    activeLangObj,
    t,
  } = useLanguage();

  const {
    emergencyModeActive,
    toggleEmergencyMode,
    activeAlertsCount,
  } = useEmergency();

  const {
    darkMode,
    toggleDarkMode,
    highContrast,
    toggleHighContrast,
  } = useTheme();

  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchQuery.trim()) return;

    navigate(
      `/dam-monitoring?q=${encodeURIComponent(searchQuery)}`
    );
  };

  return (
    <header
      className={`sticky top-0 z-30 w-full backdrop-blur-md border-b transition-colors ${
        darkMode
          ? "bg-slate-900/95 border-slate-800 text-slate-100"
          : "bg-white/95 border-slate-200 text-slate-900"
      }`}
    >
      <div className="px-4 sm:px-6 flex items-center justify-between h-16 gap-4">

        {/* Left: Mobile Toggle + Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className={`p-2 rounded-lg transition-colors lg:hidden ${
              darkMode
                ? "text-slate-400 hover:text-white hover:bg-slate-800"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            }`}
            aria-label="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link
            to="/dashboard"
            className="flex items-center gap-2.5 group"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center p-1.5 shadow-md group-hover:ring-2 group-hover:ring-blue-400 transition-all">
              <Shield className="w-full h-full text-white" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span
                  className={`font-extrabold text-lg tracking-wider ${
                    darkMode ? "text-white" : "text-slate-900"
                  }`}
                >
                  PRAVAH
                </span>

                <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 bg-blue-50 text-blue-600 border border-blue-200 rounded">
                  SIH26161
                </span>
              </div>

              <p
                className={`text-[10px] -mt-0.5 tracking-tight hidden sm:block ${
                  darkMode
                    ? "text-blue-300"
                    : "text-blue-600"
                }`}
              >
                Flood Intelligence Command
              </p>
            </div>
          </Link>
        </div>

        {/* Center: Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-2">
          <form
            onSubmit={handleSearch}
            className="w-full relative"
          >
            <Search
              className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${
                darkMode
                  ? "text-slate-400"
                  : "text-slate-400"
              }`}
            />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
              placeholder={t("searchPlaceholder")}
              className={`w-full rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-1 transition-colors ${
                darkMode
                  ? "bg-slate-950 border border-slate-700 text-slate-200 placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500"
                  : "bg-slate-50 border border-slate-200 text-slate-700 placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500"
              }`}
            />
          </form>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">

          {/* LIGHT / DARK MODE */}
          <button
            onClick={toggleDarkMode}
            title={
              darkMode
                ? "Switch to Light Theme"
                : "Switch to Dark Theme"
            }
            aria-label={
              darkMode
                ? "Switch to Light Theme"
                : "Switch to Dark Theme"
            }
            className={`p-2 rounded-lg border transition-all ${
              darkMode
                ? "bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-700"
                : "bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100"
            }`}
          >
            {darkMode ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          {/* High Contrast */}
          <button
            onClick={toggleHighContrast}
            title={
              highContrast
                ? "Disable High Contrast"
                : "High Contrast Mode"
            }
            className={`p-2 rounded-lg border text-xs flex items-center transition-colors ${
              highContrast
                ? "bg-amber-500 text-slate-950 border-amber-400 font-bold"
                : darkMode
                ? "border-slate-700 text-slate-300 hover:bg-slate-800"
                : "border-slate-200 text-slate-500 hover:bg-slate-100"
            }`}
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Language */}
          <div className="relative">
            <button
              onClick={() =>
                setShowLangMenu(!showLangMenu)
              }
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs transition-colors ${
                darkMode
                  ? "border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-200"
                  : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700"
              }`}
              title="Select Language"
            >
              <Globe
                className={`w-3.5 h-3.5 ${
                  darkMode
                    ? "text-blue-400"
                    : "text-blue-600"
                }`}
              />

              <span className="hidden sm:inline font-medium">
                {activeLangObj.nativeName}
              </span>

              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showLangMenu && (
              <div
                className={`absolute right-0 mt-2 w-48 rounded-lg shadow-xl py-1.5 z-50 max-h-72 overflow-y-auto border ${
                  darkMode
                    ? "bg-slate-900 border-slate-700"
                    : "bg-white border-slate-200"
                }`}
              >
                <div
                  className={`px-3 py-1 text-[10px] font-semibold uppercase tracking-wider border-b ${
                    darkMode
                      ? "text-slate-400 border-slate-800"
                      : "text-slate-500 border-slate-200"
                  }`}
                >
                  Select Language
                </div>

                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between transition-colors ${
                      currentLanguage === lang.code
                        ? darkMode
                          ? "text-blue-400 font-bold bg-slate-800"
                          : "text-blue-600 font-bold bg-blue-50"
                        : darkMode
                        ? "text-slate-300 hover:bg-slate-800"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <span>{lang.nativeName}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {lang.name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Alerts */}
          <Link
            to="/alerts"
            className={`relative p-2 rounded-lg border transition-colors ${
              darkMode
                ? "text-slate-300 hover:text-white hover:bg-slate-800 border-slate-700/60"
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100 border-slate-200"
            }`}
            title="Alerts"
          >
            <Bell className="w-4 h-4" />

            {activeAlertsCount > 0 && (
              <span
                className={`absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white ring-2 ${
                  darkMode
                    ? "ring-slate-900"
                    : "ring-white"
                }`}
              >
                {activeAlertsCount}
              </span>
            )}
          </Link>

          {/* AI Assistant */}
          <button
            onClick={onOpenAI}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors text-xs font-semibold ${
              darkMode
                ? "bg-blue-950 border-blue-500/50 text-blue-300 hover:bg-blue-900/60"
                : "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
            }`}
            title="Ask PRAVAH AI Assistant"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span className="hidden md:inline">
              AI Assist
            </span>
          </button>

          {/* Emergency */}
          <button
            onClick={toggleEmergencyMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              emergencyModeActive
                ? "bg-red-600 hover:bg-red-500 text-white animate-pulse ring-2 ring-red-400"
                : darkMode
                ? "bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-700/50"
                : "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
            }`}
            title="Toggle National Emergency Protocol"
          >
            <Siren className="w-3.5 h-3.5" />

            <span className="hidden sm:inline">
              {emergencyModeActive
                ? "CODE RED ACTIVE"
                : "EMERGENCY"}
            </span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() =>
                setShowUserMenu(!showUserMenu)
              }
              className={`flex items-center gap-1.5 p-1.5 rounded-lg border transition-colors ${
                darkMode
                  ? "border-slate-700 hover:bg-slate-800"
                  : "border-slate-200 hover:bg-slate-100"
              }`}
            >
              <div className="w-7 h-7 rounded-full bg-blue-600 border border-blue-400 flex items-center justify-center text-xs font-bold text-white">
                {currentUser?.avatar || "U"}
              </div>

              <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
            </button>

            {showUserMenu && (
              <div
                className={`absolute right-0 mt-2 w-64 rounded-xl shadow-2xl py-2 z-50 border ${
                  darkMode
                    ? "bg-slate-900 border-slate-700 text-slate-200"
                    : "bg-white border-slate-200 text-slate-700"
                }`}
              >
                <div
                  className={`px-4 py-2 border-b ${
                    darkMode
                      ? "border-slate-800"
                      : "border-slate-200"
                  }`}
                >
                  <p
                    className={`text-xs font-bold truncate ${
                      darkMode
                        ? "text-white"
                        : "text-slate-900"
                    }`}
                  >
                    {currentUser?.name}
                  </p>

                  <p className="text-[11px] text-blue-500 truncate">
                    {currentUser?.role}
                  </p>

                  <p className="text-[10px] text-slate-400 truncate mt-0.5">
                    {currentUser?.organization}
                  </p>
                </div>

                <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Switch Authority View
                </div>

                {Object.values(USER_ROLES).map(
                  (roleName) => (
                    <button
                      key={roleName}
                      onClick={() => {
                        switchRole(roleName);
                        setShowUserMenu(false);

                        if (
                          roleName ===
                          USER_ROLES.PUBLIC_USER
                        ) {
                          navigate("/public");
                        }
                      }}
                      className={`w-full text-left px-4 py-1.5 text-xs transition-colors flex items-center justify-between ${
                        currentUser?.role === roleName
                          ? darkMode
                            ? "text-blue-400 font-bold bg-slate-800/40"
                            : "text-blue-600 font-bold bg-blue-50"
                          : darkMode
                          ? "text-slate-300 hover:bg-slate-800"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <span>{roleName}</span>

                      {currentUser?.role === roleName && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      )}
                    </button>
                  )
                )}

                <div
                  className={`border-t mt-2 pt-1 ${
                    darkMode
                      ? "border-slate-800"
                      : "border-slate-200"
                  }`}
                >
                  <Link
                    to="/settings"
                    onClick={() =>
                      setShowUserMenu(false)
                    }
                    className={`w-full text-left px-4 py-1.5 text-xs flex items-center gap-2 ${
                      darkMode
                        ? "hover:bg-slate-800 text-slate-300"
                        : "hover:bg-slate-100 text-slate-600"
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Settings & Profile</span>
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                      navigate("/login");
                    }}
                    className="w-full text-left px-4 py-1.5 text-xs hover:bg-red-50 dark:hover:bg-red-950/60 text-red-500 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;