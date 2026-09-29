import React from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Users,
  MapPin,
  Phone,
  ShieldCheck,
  Navigation,
  Droplets,
  HeartPulse,
  Zap,
} from "lucide-react";
import { MOCK_SHELTERS } from "../data/mockSimulationData";

export function Shelters() {
  const totalCapacity = MOCK_SHELTERS.reduce(
    (sum, shelter) => sum + shelter.capacity,
    0
  );

  const totalOccupancy = MOCK_SHELTERS.reduce(
    (sum, shelter) => sum + shelter.currentOccupancy,
    0
  );

  const availableCapacity = totalCapacity - totalOccupancy;

  return (
    <div className="space-y-5 text-slate-900">

      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          <div className="flex items-start gap-3">

            <div className="p-2.5 bg-green-50 rounded-lg">
              <Home className="w-5 h-5 text-green-600" />
            </div>

            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Emergency Relief Shelters
              </h1>

              <p className="text-sm text-slate-500 mt-1">
                Verified relief centers and designated high-ground
                evacuation facilities.
              </p>
            </div>

          </div>

          <Link
            to="/safe-routes"
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-sm"
          >
            <Navigation className="w-4 h-4" />
            View Safe Evacuation Routes
          </Link>

        </div>

      </div>

      {/* Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <Home className="w-5 h-5 text-blue-600 mb-2" />

          <p className="text-xs text-slate-500">
            Active Shelters
          </p>

          <p className="text-2xl font-bold text-slate-900 mt-1">
            {MOCK_SHELTERS.length}
          </p>

          <p className="text-xs text-green-600 mt-1">
            Operational
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <Users className="w-5 h-5 text-orange-600 mb-2" />

          <p className="text-xs text-slate-500">
            Current Occupancy
          </p>

          <p className="text-2xl font-bold text-slate-900 mt-1">
            {totalOccupancy.toLocaleString()}
          </p>

          <p className="text-xs text-slate-500 mt-1">
            People accommodated
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <ShieldCheck className="w-5 h-5 text-green-600 mb-2" />

          <p className="text-xs text-slate-500">
            Total Capacity
          </p>

          <p className="text-2xl font-bold text-slate-900 mt-1">
            {totalCapacity.toLocaleString()}
          </p>

          <p className="text-xs text-slate-500 mt-1">
            Registered capacity
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <Users className="w-5 h-5 text-blue-600 mb-2" />

          <p className="text-xs text-slate-500">
            Available Capacity
          </p>

          <p className="text-2xl font-bold text-slate-900 mt-1">
            {availableCapacity.toLocaleString()}
          </p>

          <p className="text-xs text-green-600 mt-1">
            Remaining spaces
          </p>
        </div>

      </div>

      {/* Shelter Grid */}
      <div>

        <div className="flex items-center justify-between mb-3">

          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Designated Relief Centers
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Shelter status, occupancy and available facilities.
            </p>
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

          {MOCK_SHELTERS.map((shelter) => {

            const occupancyRate = Math.round(
              (shelter.currentOccupancy / shelter.capacity) * 100
            );

            const isHighOccupancy = occupancyRate >= 80;

            return (
              <div
                key={shelter.id}
                className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >

                {/* Card Header */}
                <div className="p-5 border-b border-slate-100">

                  <div className="flex items-start justify-between gap-3">

                    <div className="flex items-start gap-2.5">

                      <div className="p-2 bg-blue-50 rounded-lg shrink-0">
                        <Home className="w-4 h-4 text-blue-600" />
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-slate-900">
                          {shelter.name}
                        </h3>

                        <div className="flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3 text-slate-400" />

                          <span className="text-xs text-slate-500">
                            High-ground relief center
                          </span>
                        </div>
                      </div>

                    </div>

                    <span
                      className={`shrink-0 px-2 py-1 rounded-full text-[10px] font-semibold ${
                        shelter.status === "OPEN"
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {shelter.status}
                    </span>

                  </div>

                </div>

                {/* Card Body */}
                <div className="p-5 space-y-4">

                  {/* Elevation */}
                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-green-600" />

                      <span className="text-xs text-slate-500">
                        Safe elevation
                      </span>
                    </div>

                    <span className="text-sm font-bold text-green-700">
                      +{shelter.elevationMeters}m
                    </span>

                  </div>

                  {/* Occupancy */}
                  <div>

                    <div className="flex items-center justify-between mb-1.5">

                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-slate-400" />

                        <span className="text-xs font-medium text-slate-600">
                          Occupancy
                        </span>
                      </div>

                      <span
                        className={`text-xs font-bold ${
                          isHighOccupancy
                            ? "text-orange-600"
                            : "text-slate-700"
                        }`}
                      >
                        {shelter.currentOccupancy.toLocaleString()} /{" "}
                        {shelter.capacity.toLocaleString()}
                      </span>

                    </div>

                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">

                      <div
                        className={`h-full rounded-full transition-all ${
                          isHighOccupancy
                            ? "bg-orange-500"
                            : "bg-green-500"
                        }`}
                        style={{
                          width: `${Math.min(occupancyRate, 100)}%`,
                        }}
                      />

                    </div>

                    <div className="flex justify-between mt-1">

                      <span className="text-[11px] text-slate-400">
                        Occupied
                      </span>

                      <span
                        className={`text-[11px] font-semibold ${
                          isHighOccupancy
                            ? "text-orange-600"
                            : "text-green-600"
                        }`}
                      >
                        {occupancyRate}%
                      </span>

                    </div>

                  </div>

                  {/* Facilities */}
                  <div>

                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">
                      Available Facilities
                    </p>

                    <div className="flex flex-wrap gap-1.5">

                      {shelter.facilities.map((facility, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-md text-[10px] text-slate-600"
                        >
                          {facility}
                        </span>
                      ))}

                    </div>

                  </div>

                  {/* Facility Indicators */}
                  <div className="grid grid-cols-3 gap-2">

                    <div className="p-2 bg-slate-50 rounded-lg text-center">
                      <Droplets className="w-4 h-4 text-blue-500 mx-auto" />

                      <p className="text-[9px] text-slate-500 mt-1">
                        Water
                      </p>
                    </div>

                    <div className="p-2 bg-slate-50 rounded-lg text-center">
                      <HeartPulse className="w-4 h-4 text-red-500 mx-auto" />

                      <p className="text-[9px] text-slate-500 mt-1">
                        Medical
                      </p>
                    </div>

                    <div className="p-2 bg-slate-50 rounded-lg text-center">
                      <Zap className="w-4 h-4 text-amber-500 mx-auto" />

                      <p className="text-[9px] text-slate-500 mt-1">
                        Power
                      </p>
                    </div>

                  </div>

                </div>

                {/* Footer */}
                <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between gap-3">

                  <a
                    href={`tel:${shelter.contact}`}
                    className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-blue-600"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    {shelter.contact}
                  </a>

                  <Link
                    to="/safe-routes"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    Get Route
                  </Link>

                </div>

              </div>
            );
          })}

        </div>

      </div>

      {/* Safety Notice */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">

        <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />

        <div>
          <p className="text-sm font-semibold text-blue-800">
            Shelter Safety Information
          </p>

          <p className="text-xs text-blue-700 mt-1 leading-5">
            Follow instructions from local disaster-management officials
            when travelling to a relief center. Shelter occupancy and
            accessibility may change during an active emergency.
          </p>
        </div>

      </div>

    </div>
  );
}

export default Shelters;