import React, { useState } from "react";
import { FloodMap } from "../components/FloodMap";
import { DAMS_DATA } from "../data/damData";
import {
  MapPin,
  ShieldAlert,
  Home,
  Navigation,
  Info,
  Layers,
} from "lucide-react";

export function LiveMap() {
  const [selectedDam, setSelectedDam] = useState(DAMS_DATA[1]);

  return (
    <div className="space-y-5 text-slate-900">

      {/* HEADER */}
      <section className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>

            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900">
                National Dam Flood &amp; Inundation GIS Map
              </h1>

              <p className="text-sm text-slate-500 mt-1">
                Geospatial monitoring of reservoirs, modeled inundation
                zones, shelters and evacuation corridors.
              </p>
            </div>

          </div>


          {/* DAM SELECTOR */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">

            <span className="text-xs font-semibold text-slate-600">
              Focus Reservoir
            </span>

            <select
              value={selectedDam?.id}
              onChange={(e) => {
                const found = DAMS_DATA.find(
                  (dam) => dam.id === e.target.value
                );

                if (found) {
                  setSelectedDam(found);
                }
              }}
              className="
                h-10
                min-w-[220px]
                px-3
                rounded-lg
                border
                border-slate-300
                bg-white
                text-sm
                text-slate-800
                focus:outline-none
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
              "
            >
              {DAMS_DATA.map((dam) => (
                <option key={dam.id} value={dam.id}>
                  {dam.name} ({dam.state}) - {dam.riskLevel}
                </option>
              ))}
            </select>

          </div>

        </div>
      </section>


      {/* SELECTED DAM SUMMARY */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-slate-500">
            Reservoir
          </p>

          <p className="text-sm font-bold text-slate-900 mt-1">
            {selectedDam.name}
          </p>

          <p className="text-xs text-slate-500 mt-1">
            {selectedDam.state}
          </p>
        </div>


        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-slate-500">
            Current Storage
          </p>

          <p className="text-xl font-bold text-blue-600 mt-1">
            {selectedDam.storagePercentage}%
          </p>

          <p className="text-xs text-slate-500 mt-1">
            Reservoir utilization
          </p>
        </div>


        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-slate-500">
            Water Level
          </p>

          <p className="text-xl font-bold text-slate-900 mt-1">
            {selectedDam.currentWaterLevel} m
          </p>

          <p className="text-xs text-slate-500 mt-1">
            Current monitored level
          </p>
        </div>


        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs text-slate-500">
            Risk Status
          </p>

          <span
            className={`inline-flex mt-2 px-2.5 py-1 rounded-full text-xs font-semibold ${
              selectedDam.riskLevel === "CRITICAL"
                ? "bg-red-50 text-red-700 border border-red-200"
                : selectedDam.riskLevel === "HIGH"
                ? "bg-orange-50 text-orange-700 border border-orange-200"
                : "bg-green-50 text-green-700 border border-green-200"
            }`}
          >
            {selectedDam.riskLevel}
          </span>
        </div>

      </section>


      {/* MAP */}
      <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

        <div className="
          px-5
          py-4
          border-b
          border-slate-200
          flex
          flex-col
          sm:flex-row
          sm:items-center
          sm:justify-between
          gap-2
        ">

          <div className="flex items-center gap-2">

            <Layers className="w-4 h-4 text-blue-600" />

            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Live GIS Flood Monitoring Map
              </h2>

              <p className="text-xs text-slate-500 mt-0.5">
                Reservoir perimeter, inundation modeling and emergency
                response layers.
              </p>
            </div>

          </div>


          <span className="
            inline-flex
            items-center
            gap-1.5
            px-2.5
            py-1
            rounded-full
            bg-green-50
            border
            border-green-200
            text-green-700
            text-xs
            font-semibold
          ">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Map Monitoring Active
          </span>

        </div>


        <div className="p-3 bg-slate-50">

          <FloodMap
            selectedDam={selectedDam}
            center={[selectedDam.lat, selectedDam.lng]}
            zoom={9}
            height="640px"
          />

        </div>

      </section>


      {/* MAP LEGEND / INFORMATION */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* SURGE */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">

          <div className="flex items-center gap-2 mb-3">

            <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-red-600" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900">
                High-Velocity Surge Zone
              </h3>

              <p className="text-xs text-red-600 font-medium">
                Priority evacuation area
              </p>
            </div>

          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Red polygons represent modeled dam-breach water velocity
            above 3.0 m/s. Downstream river wards may require priority
            evacuation based on the modeled flood scenario.
          </p>

        </div>


        {/* SHELTERS */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">

          <div className="flex items-center gap-2 mb-3">

            <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
              <Home className="w-4 h-4 text-green-600" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Designated Relief Shelters
              </h3>

              <p className="text-xs text-green-600 font-medium">
                Emergency shelter locations
              </p>
            </div>

          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Green shelter markers identify designated relief locations
            positioned outside modeled flood-prone areas and intended
            for emergency response coordination.
          </p>

        </div>


        {/* ROUTES */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">

          <div className="flex items-center gap-2 mb-3">

            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
              <Navigation className="w-4 h-4 text-blue-600" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Safe Evacuation Corridors
              </h3>

              <p className="text-xs text-blue-600 font-medium">
                Emergency routing
              </p>
            </div>

          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            Green route overlays represent modeled safe corridors
            intended to avoid flood-prone low-ground roads, underpasses
            and bridge approaches.
          </p>

        </div>

      </section>


      {/* MAP NOTE */}
      <section className="bg-blue-50 border border-blue-100 rounded-xl p-4">

        <div className="flex items-start gap-3">

          <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />

          <div>
            <h3 className="text-sm font-semibold text-blue-900">
              GIS Monitoring Information
            </h3>

            <p className="text-xs text-blue-800 mt-1 leading-relaxed">
              Select a reservoir above to reposition the map and review
              its associated flood-monitoring layers. Modeled inundation
              zones are scenario outputs and should be interpreted
              together with official emergency and hydrological
              information.
            </p>
          </div>

        </div>

      </section>

    </div>
  );
}

export default LiveMap;