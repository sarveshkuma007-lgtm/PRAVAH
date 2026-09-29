import React, { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Activity,
  Search,
  Plus,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

import { DAMS_DATA } from "../data/damData";
import { DamHealthCard } from "../components/DamHealthCard";
import { useAuth } from "../context/AuthContext";
import { USER_ROLES } from "../utils/constants";

export function DamMonitoring() {
  const [searchParams] = useSearchParams();

  const initialQuery = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedRisk, setSelectedRisk] = useState("ALL");
  const [selectedState, setSelectedState] = useState("ALL");

  const { currentUser } = useAuth();

  /* =========================================================
     STATES
     ========================================================= */

  const statesList = useMemo(() => {
    return Array.from(
      new Set(DAMS_DATA.map((dam) => dam.state))
    ).sort();
  }, []);

  /* =========================================================
     FILTER DAMS
     ========================================================= */

  const filteredDams = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return DAMS_DATA.filter((dam) => {
      const matchesSearch =
        !query ||
        dam.name?.toLowerCase().includes(query) ||
        dam.river?.toLowerCase().includes(query) ||
        dam.state?.toLowerCase().includes(query) ||
        dam.cwcCode?.toLowerCase().includes(query);

      const matchesRisk =
        selectedRisk === "ALL" ||
        dam.riskLevel === selectedRisk;

      const matchesState =
        selectedState === "ALL" ||
        dam.state === selectedState;

      return (
        matchesSearch &&
        matchesRisk &&
        matchesState
      );
    });
  }, [
    searchQuery,
    selectedRisk,
    selectedState,
  ]);

  /* =========================================================
     ROLE CHECK
     ========================================================= */

  const canManage =
    currentUser?.role === USER_ROLES.ADMIN ||
    currentUser?.role === USER_ROLES.GOVT_OFFICIAL;

  /* =========================================================
     SUMMARY COUNTS
     ========================================================= */

  const criticalCount = DAMS_DATA.filter(
    (dam) => dam.riskLevel === "CRITICAL"
  ).length;

  const highCount = DAMS_DATA.filter(
    (dam) => dam.riskLevel === "HIGH"
  ).length;

  const moderateCount = DAMS_DATA.filter(
    (dam) => dam.riskLevel === "MODERATE"
  ).length;

  const normalCount = DAMS_DATA.filter(
    (dam) => dam.riskLevel === "NORMAL"
  ).length;

  /* =========================================================
     RESET
     ========================================================= */

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedRisk("ALL");
    setSelectedState("ALL");
  };

  return (
    <div className="dam-monitoring-page space-y-6">

      {/* =====================================================
          PAGE HEADER
          ===================================================== */}

      <section className="bg-white border border-slate-200 rounded-xl shadow-sm">

        <div className="p-5 sm:p-6">

          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">

            <div>

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-blue-600" />
                </div>

                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                    National Dam Hydrological Monitoring Fleet
                  </h1>

                  <p className="text-sm text-slate-500 mt-1">
                    Real-time telemetry, reservoir levels,
                    spillway operations and hydrological status.
                  </p>
                </div>

              </div>

            </div>


            {/* Register dam */}

            {canManage && (
              <Link
                to="/manage-dams"
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  px-4
                  py-2.5
                  rounded-lg
                  bg-blue-600
                  hover:bg-blue-700
                  text-white
                  text-sm
                  font-semibold
                  transition-colors
                  shadow-sm
                "
              >
                <Plus className="w-4 h-4" />
                Register New Dam
              </Link>
            )}

          </div>

        </div>

      </section>


      {/* =====================================================
          MONITORING SUMMARY
          ===================================================== */}

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3">

        {/* Total */}

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">

          <div className="flex items-center justify-between">

            <span className="text-xs font-medium text-slate-500">
              Monitored Dams
            </span>

            <Activity className="w-4 h-4 text-blue-600" />

          </div>

          <div className="mt-2 text-2xl font-bold text-slate-900">
            {DAMS_DATA.length}
          </div>

          <p className="text-xs text-slate-500 mt-1">
            National monitoring network
          </p>

        </div>


        {/* Critical */}

        <div className="bg-white border border-red-200 rounded-xl p-4 shadow-sm">

          <div className="flex items-center justify-between">

            <span className="text-xs font-medium text-slate-500">
              Critical
            </span>

            <ShieldAlert className="w-4 h-4 text-red-600" />

          </div>

          <div className="mt-2 text-2xl font-bold text-red-600">
            {criticalCount}
          </div>

          <p className="text-xs text-slate-500 mt-1">
            Immediate attention
          </p>

        </div>


        {/* High */}

        <div className="bg-white border border-orange-200 rounded-xl p-4 shadow-sm">

          <div className="flex items-center justify-between">

            <span className="text-xs font-medium text-slate-500">
              High Risk
            </span>

            <AlertTriangle className="w-4 h-4 text-orange-500" />

          </div>

          <div className="mt-2 text-2xl font-bold text-orange-600">
            {highCount}
          </div>

          <p className="text-xs text-slate-500 mt-1">
            Enhanced monitoring
          </p>

        </div>


        {/* Normal */}

        <div className="bg-white border border-green-200 rounded-xl p-4 shadow-sm">

          <div className="flex items-center justify-between">

            <span className="text-xs font-medium text-slate-500">
              Normal
            </span>

            <CheckCircle2 className="w-4 h-4 text-green-600" />

          </div>

          <div className="mt-2 text-2xl font-bold text-green-600">
            {normalCount}
          </div>

          <p className="text-xs text-slate-500 mt-1">
            Operating normally
          </p>

        </div>

      </section>


      {/* =====================================================
          FILTER PANEL
          ===================================================== */}

      <section className="bg-white border border-slate-200 rounded-xl shadow-sm">

        <div className="p-4">

          <div className="flex items-center gap-2 mb-4">

            <Search className="w-4 h-4 text-blue-600" />

            <h2 className="text-sm font-semibold text-slate-900">
              Search & Filter Reservoirs
            </h2>

          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">

            {/* Search */}

            <div className="relative xl:col-span-2">

              <Search
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  w-4
                  h-4
                  text-slate-400
                "
              />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
                placeholder="Search dam, river, state or CWC code..."
                className="
                  w-full
                  h-10
                  bg-white
                  border
                  border-slate-300
                  rounded-lg
                  pl-9
                  pr-4
                  text-sm
                  text-slate-900
                  placeholder-slate-400
                  focus:outline-none
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-100
                "
              />

            </div>


            {/* Risk */}

            <select
              value={selectedRisk}
              onChange={(e) =>
                setSelectedRisk(e.target.value)
              }
              className="
                h-10
                w-full
                bg-white
                border
                border-slate-300
                rounded-lg
                px-3
                text-sm
                text-slate-700
                focus:outline-none
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
              "
            >

              <option value="ALL">
                All Risk Levels
              </option>

              <option value="CRITICAL">
                Critical Danger
              </option>

              <option value="HIGH">
                High Alert
              </option>

              <option value="MODERATE">
                Moderate Watch
              </option>

              <option value="NORMAL">
                Normal
              </option>

            </select>


            {/* State */}

            <select
              value={selectedState}
              onChange={(e) =>
                setSelectedState(e.target.value)
              }
              className="
                h-10
                w-full
                bg-white
                border
                border-slate-300
                rounded-lg
                px-3
                text-sm
                text-slate-700
                focus:outline-none
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
              "
            >

              <option value="ALL">
                All States (National)
              </option>

              {statesList.map((state) => (
                <option
                  key={state}
                  value={state}
                >
                  {state}
                </option>
              ))}

            </select>

          </div>

        </div>

      </section>


      {/* =====================================================
          RESULTS HEADER
          ===================================================== */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

        <div>

          <h2 className="text-base font-semibold text-slate-900">
            Monitored Reservoirs
          </h2>

          <p className="text-xs text-slate-500 mt-1">
            Showing{" "}
            <span className="font-semibold text-slate-700">
              {filteredDams.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-700">
              {DAMS_DATA.length}
            </span>{" "}
            monitored reservoirs
          </p>

        </div>


        {/* Risk legend */}

        <div className="flex items-center gap-4 text-xs">

          <span className="flex items-center gap-1.5 text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            Critical: {criticalCount}
          </span>

          <span className="flex items-center gap-1.5 text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
            High: {highCount}
          </span>

          <span className="hidden sm:flex items-center gap-1.5 text-slate-600">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            Moderate: {moderateCount}
          </span>

        </div>

      </div>


      {/* =====================================================
          DAM CARDS
          ===================================================== */}

      {filteredDams.length > 0 ? (

        <div className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-3
          2xl:grid-cols-4
          gap-4
        ">

          {filteredDams.map((dam) => (

            <div
              key={dam.id}
              className="
                dam-health-wrapper
                bg-white
                rounded-xl
                border
                border-slate-200
                shadow-sm
                overflow-hidden
                transition-all
                duration-200
                hover:shadow-md
                hover:border-blue-200
              "
            >

              <DamHealthCard dam={dam} />

            </div>

          ))}

        </div>

      ) : (

        /* ===================================================
           EMPTY STATE
           =================================================== */

        <div className="
          bg-white
          border
          border-slate-200
          rounded-xl
          p-12
          text-center
          shadow-sm
        ">

          <div className="
            mx-auto
            w-12
            h-12
            rounded-full
            bg-blue-50
            flex
            items-center
            justify-center
            mb-4
          ">

            <Search className="w-5 h-5 text-blue-600" />

          </div>

          <h3 className="text-sm font-semibold text-slate-900">
            No reservoirs found
          </h3>

          <p className="text-xs text-slate-500 mt-1">
            No reservoirs match the selected search and filter criteria.
          </p>

          <button
            onClick={resetFilters}
            className="
              mt-4
              px-4
              py-2
              rounded-lg
              bg-blue-600
              hover:bg-blue-700
              text-white
              text-xs
              font-semibold
              transition-colors
            "
          >
            Reset Filters
          </button>

        </div>

      )}


      {/* =====================================================
          PAGE-SPECIFIC CARD OVERRIDES
          
          These only affect Dam Monitoring's existing
          DamHealthCard component.
          ===================================================== */}

      <style>{`

        .dam-monitoring-page {
          color: #172033;
        }

        .dam-monitoring-page .dam-health-wrapper > div {
          background: #ffffff !important;
          color: #172033 !important;
          border-color: #e2e8f0 !important;
          box-shadow: none !important;
        }

        .dam-monitoring-page .dam-health-wrapper [class*="bg-slate-950"],
        .dam-monitoring-page .dam-health-wrapper [class*="bg-slate-900"],
        .dam-monitoring-page .dam-health-wrapper [class*="bg-slate-800"] {
          background-color: #f8fafc !important;
        }

        .dam-monitoring-page .dam-health-wrapper [class*="text-white"] {
          color: #172033 !important;
        }

        .dam-monitoring-page .dam-health-wrapper [class*="text-slate-100"] {
          color: #334155 !important;
        }

        .dam-monitoring-page .dam-health-wrapper [class*="text-slate-200"] {
          color: #475569 !important;
        }

        .dam-monitoring-page .dam-health-wrapper [class*="text-slate-300"] {
          color: #64748b !important;
        }

        .dam-monitoring-page .dam-health-wrapper [class*="text-slate-400"] {
          color: #64748b !important;
        }

        .dam-monitoring-page .dam-health-wrapper [class*="border-slate-700"],
        .dam-monitoring-page .dam-health-wrapper [class*="border-slate-800"] {
          border-color: #e2e8f0 !important;
        }

        .dam-monitoring-page .dam-health-wrapper [class*="shadow-2xl"],
        .dam-monitoring-page .dam-health-wrapper [class*="shadow-xl"],
        .dam-monitoring-page .dam-health-wrapper [class*="shadow-lg"] {
          box-shadow: none !important;
        }

        .dam-monitoring-page .dam-health-wrapper input,
        .dam-monitoring-page .dam-health-wrapper select {
          background: #ffffff !important;
          color: #172033 !important;
        }

      `}</style>

    </div>
  );
}

export default DamMonitoring;