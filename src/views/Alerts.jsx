import React, { useState } from "react";
import {
  Bell,
  AlertTriangle,
  Siren,
  Plus,
  CheckCircle2,
  Send,
  X,
  ShieldAlert,
  MapPin,
} from "lucide-react";

import { useEmergency } from "../context/EmergencyContext";
import { useAuth } from "../context/AuthContext";
import { AlertCard } from "../components/AlertCard";
import { USER_ROLES } from "../utils/constants";

export function Alerts() {
  const {
    alerts,
    broadcastAlert,
    acknowledgeAlert,
  } = useEmergency();

  const { currentUser } = useAuth();

  const [filterSeverity, setFilterSeverity] = useState("ALL");
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newSeverity, setNewSeverity] = useState("CRITICAL");
  const [newCategory, setNewCategory] = useState("DAM_DISCHARGE");
  const [newDesc, setNewDesc] = useState("");
  const [newAction, setNewAction] = useState("");
  const [newLocation, setNewLocation] = useState(
    "Hirakud Downstream, Sambalpur"
  );

  const canBroadcast =
    currentUser?.role === USER_ROLES.ADMIN ||
    currentUser?.role === USER_ROLES.GOVT_OFFICIAL ||
    currentUser?.role === USER_ROLES.DISASTER_OFFICER;

  const criticalCount = alerts.filter(
    (a) => a.severity === "CRITICAL" && a.status === "ACTIVE"
  ).length;

  const highCount = alerts.filter(
    (a) => a.severity === "HIGH" && a.status === "ACTIVE"
  ).length;

  const moderateCount = alerts.filter(
    (a) => a.severity === "MODERATE" && a.status === "ACTIVE"
  ).length;

  const acknowledgedCount = alerts.filter(
    (a) => a.status === "ACKNOWLEDGED"
  ).length;

  const filteredAlerts = alerts.filter((alert) => {
    if (filterSeverity === "ALL") return true;

    if (filterSeverity === "ACKNOWLEDGED") {
      return alert.status === "ACKNOWLEDGED";
    }

    return (
      alert.severity === filterSeverity &&
      alert.status === "ACTIVE"
    );
  });

  const handleBroadcastSubmit = (e) => {
    e.preventDefault();

    if (!newTitle.trim() || !newDesc.trim()) return;

    broadcastAlert({
      title: newTitle,
      severity: newSeverity,
      category: newCategory,
      description: newDesc,
      recommendedAction: newAction,
      location: newLocation,
      issuedBy: `${currentUser?.name} (${
        currentUser?.organization || "National Command"
      })`,
    });

    setNewTitle("");
    setNewDesc("");
    setNewAction("");
    setShowBroadcastModal(false);
  };

  const tabs = [
    {
      key: "ALL",
      label: "All Alerts",
      count: alerts.length,
      icon: Bell,
    },
    {
      key: "CRITICAL",
      label: "Critical",
      count: criticalCount,
      icon: ShieldAlert,
    },
    {
      key: "HIGH",
      label: "High",
      count: highCount,
      icon: AlertTriangle,
    },
    {
      key: "MODERATE",
      label: "Moderate",
      count: moderateCount,
      icon: Bell,
    },
    {
      key: "ACKNOWLEDGED",
      label: "Acknowledged",
      count: acknowledgedCount,
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="alerts-page space-y-5 text-slate-900">

      {/* =========================================================
          ALERT CARD READABILITY FIX
          Keeps severity colors but forces secondary text to be readable
          on the light alert-card backgrounds.
      ========================================================== */}
      <style>{`
        .alerts-page .text-slate-300 {
          color: #334155 !important;
        }

        .alerts-page .text-slate-400 {
          color: #475569 !important;
        }

        .alerts-page .text-slate-500 {
          color: #64748b !important;
        }

        .alerts-page .text-cyan-300 {
          color: #0891b2 !important;
        }

        .alerts-page .text-cyan-400 {
          color: #0891b2 !important;
        }

        .alerts-page .text-blue-300 {
          color: #2563eb !important;
        }

        /* Keep alert titles dark and readable */
        .alerts-page .font-bold.text-white,
        .alerts-page .font-semibold.text-white {
          color: #0f172a !important;
        }

        /* Don't override emergency/severity buttons and badges */
        .alerts-page button.bg-red-600,
        .alerts-page button.bg-red-700,
        .alerts-page .bg-red-600.text-white,
        .alerts-page .bg-orange-500.text-white,
        .alerts-page .bg-amber-500.text-white {
          color: #ffffff !important;
        }
      `}</style>

      {/* =========================================================
          HEADER
      ========================================================== */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          <div>
            <div className="flex items-center gap-2">

              <div className="p-2 bg-red-50 rounded-lg">
                <Bell className="w-5 h-5 text-red-600" />
              </div>

              <div>
                <h1 className="text-xl font-bold text-slate-900">
                  Emergency Alerts & Bulletins
                </h1>

                <p className="text-sm text-slate-500 mt-0.5">
                  Flood warnings, dam discharge notifications and
                  emergency public communications.
                </p>
              </div>

            </div>
          </div>

          {canBroadcast && (
            <button
              onClick={() => setShowBroadcastModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              Broadcast Emergency Bulletin
            </button>
          )}

        </div>
      </div>

      {/* =========================================================
          SUMMARY CARDS
      ========================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Critical */}
        <div className="bg-white border border-red-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">
                Critical Alerts
              </p>

              <p className="text-2xl font-bold text-red-600 mt-1">
                {criticalCount}
              </p>
            </div>

            <div className="p-2 bg-red-50 rounded-lg">
              <ShieldAlert className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>

        {/* High */}
        <div className="bg-white border border-orange-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">
                High Priority
              </p>

              <p className="text-2xl font-bold text-orange-600 mt-1">
                {highCount}
              </p>
            </div>

            <div className="p-2 bg-orange-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Moderate */}
        <div className="bg-white border border-amber-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">
                Moderate
              </p>

              <p className="text-2xl font-bold text-amber-600 mt-1">
                {moderateCount}
              </p>
            </div>

            <div className="p-2 bg-amber-50 rounded-lg">
              <Bell className="w-5 h-5 text-amber-600" />
            </div>
          </div>
        </div>

        {/* Acknowledged */}
        <div className="bg-white border border-green-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500">
                Acknowledged
              </p>

              <p className="text-2xl font-bold text-green-600 mt-1">
                {acknowledgedCount}
              </p>
            </div>

            <div className="p-2 bg-green-50 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

      </div>

      {/* =========================================================
          FILTERS
      ========================================================== */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto">

          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = filterSeverity === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => setFilterSeverity(tab.key)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium whitespace-nowrap transition-colors ${
                  active
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <Icon className="w-4 h-4" />

                <span>{tab.label}</span>

                <span
                  className={`px-1.5 py-0.5 rounded-md text-xs ${
                    active
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}

        </div>
      </div>

      {/* =========================================================
          ALERT FEED
      ========================================================== */}
      <div className="space-y-3">

        {filteredAlerts.map((alert) => (
          <AlertCard
            key={alert.id}
            alert={alert}
            onAcknowledge={acknowledgeAlert}
          />
        ))}

        {filteredAlerts.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm">

            <div className="mx-auto w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>

            <h3 className="mt-3 text-sm font-semibold text-slate-900">
              No alerts found
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              There are no alerts matching the selected filter.
            </p>

          </div>
        )}

      </div>

      {/* =========================================================
          BROADCAST MODAL
      ========================================================== */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40">

          <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">

              <div className="flex items-center gap-3">

                <div className="p-2 bg-red-50 rounded-lg">
                  <Siren className="w-5 h-5 text-red-600" />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Issue Emergency Bulletin
                  </h2>

                  <p className="text-xs text-slate-500 mt-0.5">
                    Multi-agency public warning broadcast
                  </p>
                </div>

              </div>

              <button
                onClick={() => setShowBroadcastModal(false)}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>

            </div>

            {/* Form */}
            <form
              onSubmit={handleBroadcastSubmit}
              className="p-6 space-y-4"
            >

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Alert Title
                </label>

                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Emergency flood bulletin title"
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                />
              </div>

              {/* Severity + Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Severity Level
                  </label>

                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                  >
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MODERATE">Moderate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Category
                  </label>

                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                  >
                    <option value="DAM_DISCHARGE">
                      Dam Discharge
                    </option>
                    <option value="FLASH_FLOOD">
                      Flash Flood
                    </option>
                    <option value="CLOUDBURST">
                      Cloudburst
                    </option>
                    <option value="EVACUATION">
                      Evacuation Order
                    </option>
                  </select>
                </div>

              </div>

              {/* Location */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 mb-1.5">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  Affected Location / Wards
                </label>

                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Detailed Bulletin
                </label>

                <textarea
                  rows={4}
                  required
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Describe the flood situation, expected impact and relevant instructions..."
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                />
              </div>

              {/* Recommended Action */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Recommended Citizen Action
                </label>

                <input
                  type="text"
                  value={newAction}
                  onChange={(e) => setNewAction(e.target.value)}
                  placeholder="Move to designated relief shelter immediately."
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                />
              </div>

              {/* Warning */}
              <div className="flex gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">

                <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />

                <div>
                  <p className="text-sm font-semibold text-red-800">
                    Emergency broadcast
                  </p>

                  <p className="text-xs text-red-700 mt-0.5">
                    This bulletin will be added to the emergency alert
                    system and made available to authorized users.
                  </p>
                </div>

              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2">

                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg flex items-center gap-2 shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  Transmit Broadcast
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default Alerts;