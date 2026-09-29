import React from "react";
import {
  Settings as SettingsIcon,
  Globe,
  Eye,
  Volume2,
  MapPin,
  Bell,
  Sun,
  Moon,
  Monitor,
  Check,
} from "lucide-react";

import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { useEmergency } from "../context/EmergencyContext";
import { useLocation } from "../hooks/useLocation";
import { notificationService } from "../services/notificationService";

export function Settings() {
  const {
    currentLanguage,
    setLanguage,
    languages,
  } = useLanguage();

  const {
    darkMode,
    setDarkMode,
    highContrast,
    toggleHighContrast,
    largeText,
    toggleLargeText,
  } = useTheme();

  const {
    speechSafetyMode,
    toggleSpeechSafetyMode,
  } = useEmergency();

  const { setManualLocation } = useLocation();

  const handleRequestNotifications = async () => {
    const perm =
      await notificationService.requestPermission();

    if (perm === "granted") {
      notificationService.sendNotification(
        "PRAVAH Alert System Enabled",
        {
          body: "You will now receive desktop notifications for critical dam flood bulletins.",
        }
      );
    }
  };

  const settingButton = (active) =>
    `px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors ${
      active
        ? darkMode
          ? "bg-blue-600 text-white border-blue-500"
          : "bg-blue-600 text-white border-blue-600"
        : darkMode
        ? "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700"
        : "bg-white text-slate-500 border-slate-200 hover:bg-slate-100"
    }`;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-10">

      {/* Header */}
      <div
        className={`pb-4 border-b ${
          darkMode
            ? "border-slate-800"
            : "border-slate-200"
        }`}
      >
        <div className="flex items-center gap-2">
          <SettingsIcon
            className={`w-5 h-5 ${
              darkMode
                ? "text-blue-400"
                : "text-blue-600"
            }`}
          />

          <h1
            className={`text-xl font-bold ${
              darkMode
                ? "text-white"
                : "text-slate-900"
            }`}
          >
            System Preferences & Accessibility
          </h1>
        </div>

        <p
          className={`text-xs mt-1 ${
            darkMode
              ? "text-slate-400"
              : "text-slate-500"
          }`}
        >
          Configure appearance, language, accessibility,
          voice assistance and notification preferences.
        </p>
      </div>

      {/* Appearance */}
      <section
        className={`rounded-xl border shadow-sm ${
          darkMode
            ? "bg-slate-900 border-slate-800"
            : "bg-white border-slate-200"
        }`}
      >
        <div
          className={`p-5 border-b ${
            darkMode
              ? "border-slate-800"
              : "border-slate-200"
          }`}
        >
          <div className="flex items-center gap-2">
            {darkMode ? (
              <Moon className="w-4 h-4 text-blue-400" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500" />
            )}

            <h2
              className={`text-sm font-bold uppercase tracking-wide ${
                darkMode
                  ? "text-slate-100"
                  : "text-slate-800"
              }`}
            >
              Appearance
            </h2>
          </div>

          <p
            className={`text-xs mt-1 ${
              darkMode
                ? "text-slate-400"
                : "text-slate-500"
            }`}
          >
            Choose how the PRAVAH command interface
            appears across your device.
          </p>
        </div>

        <div className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Light */}
            <button
              onClick={() => setDarkMode(false)}
              className={`relative text-left rounded-xl border-2 p-4 transition-all ${
                !darkMode
                  ? "border-blue-600 bg-blue-50"
                  : "border-slate-200 bg-slate-50 hover:border-slate-300"
              }`}
            >
              {!darkMode && (
                <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </span>
              )}

              <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                <Sun className="w-5 h-5 text-amber-500" />
              </div>

              <h3 className="mt-3 text-sm font-bold text-slate-900">
                Light Theme
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Clean white interface for normal daytime
                monitoring.
              </p>
            </button>

            {/* Dark */}
            <button
              onClick={() => setDarkMode(true)}
              className={`relative text-left rounded-xl border-2 p-4 transition-all ${
                darkMode
                  ? "border-blue-500 bg-slate-800"
                  : "border-slate-200 bg-slate-50 hover:border-slate-300"
              }`}
            >
              {darkMode && (
                <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </span>
              )}

              <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center">
                <Moon className="w-5 h-5 text-blue-300" />
              </div>

              <h3
                className={`mt-3 text-sm font-bold ${
                  darkMode
                    ? "text-white"
                    : "text-slate-900"
                }`}
              >
                Dark Theme
              </h3>

              <p
                className={`mt-1 text-xs ${
                  darkMode
                    ? "text-slate-400"
                    : "text-slate-500"
                }`}
              >
                Dark navy interface for low-light command
                centre environments.
              </p>
            </button>
          </div>
        </div>
      </section>

      {/* Language */}
      <section
        className={`p-5 rounded-xl border shadow-sm space-y-4 ${
          darkMode
            ? "bg-slate-900 border-slate-800"
            : "bg-white border-slate-200"
        }`}
      >
        <div className="flex items-center gap-2">
          <Globe
            className={`w-4 h-4 ${
              darkMode
                ? "text-blue-400"
                : "text-blue-600"
            }`}
          />

          <div>
            <h2
              className={`text-sm font-bold uppercase tracking-wide ${
                darkMode
                  ? "text-slate-100"
                  : "text-slate-800"
              }`}
            >
              Multilingual Language Selection
            </h2>

            <p
              className={`text-xs mt-1 ${
                darkMode
                  ? "text-slate-400"
                  : "text-slate-500"
              }`}
            >
              Select the language used for emergency
              announcements and interface guidance.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {languages.map((lang) => {
            const active =
              currentLanguage === lang.code;

            return (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`p-3 rounded-lg border text-left transition-all ${
                  active
                    ? darkMode
                      ? "bg-blue-950 border-blue-500 text-blue-300"
                      : "bg-blue-50 border-blue-500 text-blue-700"
                    : darkMode
                    ? "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span className="text-sm font-medium">
                  {lang.nativeName}
                </span>

                <span className="block text-[10px] text-slate-400 mt-1">
                  {lang.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Accessibility */}
      <section
        className={`p-5 rounded-xl border shadow-sm space-y-4 ${
          darkMode
            ? "bg-slate-900 border-slate-800"
            : "bg-white border-slate-200"
        }`}
      >
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-amber-500" />

          <h2
            className={`text-sm font-bold uppercase tracking-wide ${
              darkMode
                ? "text-slate-100"
                : "text-slate-800"
            }`}
          >
            Accessibility & Voice Assistance
          </h2>
        </div>

        <div className="space-y-3">

          {/* Voice */}
          <div
            className={`p-4 rounded-lg border flex items-center justify-between gap-4 ${
              darkMode
                ? "bg-slate-950 border-slate-800"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <div className="flex items-start gap-3">
              <Volume2
                className={`w-4 h-4 mt-0.5 ${
                  darkMode
                    ? "text-blue-400"
                    : "text-blue-600"
                }`}
              />

              <div>
                <span
                  className={`text-xs font-bold block ${
                    darkMode
                      ? "text-slate-100"
                      : "text-slate-800"
                  }`}
                >
                  Voice Safety Mode
                </span>

                <span className="text-[11px] text-slate-500">
                  Reads critical dam warnings and evacuation
                  directions using speech synthesis.
                </span>
              </div>
            </div>

            <button
              onClick={toggleSpeechSafetyMode}
              className={settingButton(
                speechSafetyMode
              )}
            >
              {speechSafetyMode
                ? "ENABLED"
                : "DISABLED"}
            </button>
          </div>

          {/* High contrast */}
          <div
            className={`p-4 rounded-lg border flex items-center justify-between gap-4 ${
              darkMode
                ? "bg-slate-950 border-slate-800"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <div>
              <span
                className={`text-xs font-bold block ${
                  darkMode
                    ? "text-slate-100"
                    : "text-slate-800"
                }`}
              >
                High Contrast Display
              </span>

              <span className="text-[11px] text-slate-500">
                Enhances contrast for low-vision accessibility
                and outdoor viewing.
              </span>
            </div>

            <button
              onClick={toggleHighContrast}
              className={settingButton(
                highContrast
              )}
            >
              {highContrast
                ? "ENABLED"
                : "DISABLED"}
            </button>
          </div>

          {/* Large text */}
          <div
            className={`p-4 rounded-lg border flex items-center justify-between gap-4 ${
              darkMode
                ? "bg-slate-950 border-slate-800"
                : "bg-slate-50 border-slate-200"
            }`}
          >
            <div>
              <span
                className={`text-xs font-bold block ${
                  darkMode
                    ? "text-slate-100"
                    : "text-slate-800"
                }`}
              >
                Large Text Mode
              </span>

              <span className="text-[11px] text-slate-500">
                Increases typography sizing across the
                interface.
              </span>
            </div>

            <button
              onClick={toggleLargeText}
              className={settingButton(largeText)}
            >
              {largeText
                ? "ENABLED"
                : "DISABLED"}
            </button>
          </div>
        </div>
      </section>

      {/* Location */}
      <section
        className={`p-5 rounded-xl border shadow-sm space-y-4 ${
          darkMode
            ? "bg-slate-900 border-slate-800"
            : "bg-white border-slate-200"
        }`}
      >
        <div className="flex items-center gap-2">
          <MapPin
            className={`w-4 h-4 ${
              darkMode
                ? "text-blue-400"
                : "text-blue-600"
            }`}
          />

          <div>
            <h2
              className={`text-sm font-bold uppercase tracking-wide ${
                darkMode
                  ? "text-slate-100"
                  : "text-slate-800"
              }`}
            >
              Geolocation Simulation
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Simulate different dam disaster perimeters
              for testing evacuation calculations.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() =>
              setManualLocation(
                21.4669,
                83.9812,
                "Sambalpur City Center (Hirakud Surge)"
              )
            }
            className={`px-3 py-2 rounded-lg border text-xs transition-colors ${
              darkMode
                ? "bg-slate-950 border-slate-700 text-slate-300 hover:bg-slate-800"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            Hirakud Basin
          </button>

          <button
            onClick={() =>
              setManualLocation(
                30.0869,
                78.2676,
                "Rishikesh Downstream (Tehri Dam)"
              )
            }
            className={`px-3 py-2 rounded-lg border text-xs transition-colors ${
              darkMode
                ? "bg-slate-950 border-slate-700 text-slate-300 hover:bg-slate-800"
                : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
            }`}
          >
            Tehri Basin
          </button>

          <button
            onClick={() =>
              setManualLocation(
                21.8315,
                73.7483,
                "Kevadia Colony (Sardar Sarovar)"
              )
            }
            className={`px-3 py-2 rounded-lg border text-xs transition-colors ${
              darkMode
                ? "bg-slate-950 border-slate-700 text-slate-300 hover:bg-slate-800"
                : "bg-slate-50 border-slate-200 text-slate-300 hover:bg-slate-800"
            }`}
          >
            Narmada Basin
          </button>
        </div>
      </section>

      {/* Notifications */}
      <section
        className={`p-5 rounded-xl border shadow-sm flex items-center justify-between gap-4 ${
          darkMode
            ? "bg-slate-900 border-slate-800"
            : "bg-white border-slate-200"
        }`}
      >
        <div className="flex items-start gap-3">
          <Bell
            className={`w-4 h-4 mt-0.5 ${
              darkMode
                ? "text-blue-400"
                : "text-blue-600"
            }`}
          />

          <div>
            <span
              className={`text-xs font-bold block ${
                darkMode
                  ? "text-slate-100"
                  : "text-slate-800"
              }`}
            >
              Desktop Push Notifications
            </span>

            <span className="text-[11px] text-slate-500">
              Receive pop-up notifications for critical
              dam flood bulletins.
            </span>
          </div>
        </div>

        <button
          onClick={handleRequestNotifications}
          className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors"
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Enable</span>
        </button>
      </section>

      {/* Current theme status */}
      <div
        className={`flex items-center justify-between px-4 py-3 rounded-lg border ${
          darkMode
            ? "bg-blue-950/40 border-blue-900/50"
            : "bg-blue-50 border-blue-100"
        }`}
      >
        <div className="flex items-center gap-2">
          {darkMode ? (
            <Moon className="w-4 h-4 text-blue-400" />
          ) : (
            <Sun className="w-4 h-4 text-amber-500" />
          )}

          <span
            className={`text-xs font-medium ${
              darkMode
                ? "text-blue-200"
                : "text-blue-700"
            }`}
          >
            Current theme:{" "}
            <strong>
              {darkMode ? "Dark" : "Light"}
            </strong>
          </span>
        </div>

        <button
          onClick={() => setDarkMode(!darkMode)}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700"
        >
          Switch Theme
        </button>
      </div>
    </div>
  );
}

export default Settings;