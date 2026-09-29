import React, { useEffect, useState } from "react";
import { FloodMap } from "../components/FloodMap";
import { DAMS_DATA } from "../data/damData";
import {
  MapPin,
  ShieldAlert,
  Home,
  Navigation,
} from "lucide-react";

export function LiveMap() {
  const [selectedDam, setSelectedDam] = useState(DAMS_DATA[1]);

  // Force Leaflet/map components to recalculate their dimensions
  // after the dashboard layout has finished rendering.
  useEffect(() => {
    const timers = [
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 100),

      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 500),

      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 1000),
    ];

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [selectedDam]);

  const handleDamChange = (e) => {
    const found = DAMS_DATA.find(
      (d) => d.id === e.target.value
    );

    if (found) {
      setSelectedDam(found);
    }
  };

  return (
    <div className="w-full min-w-0 space-y-4">
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-cyan-400 shrink-0" />

            <h1 className="text-xl font-black text-white font-sans truncate">
              National Dam Flood &amp; Inundation GIS Map
            </h1>
          </div>

          <p className="text-xs text-slate-400 mt-1">
            Geospatial layers for reservoir perimeters,
            Delft3D breach inundation zones, and relief shelters.
          </p>
        </div>

        {/* ================================================= */}
        {/* QUICK DAM SELECTOR */}
        {/* ================================================= */}

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-slate-400 font-mono whitespace-nowrap">
            Focus Reservoir:
          </span>

          <select
            value={selectedDam?.id || ""}
            onChange={handleDamChange}
            className="
              bg-slate-900
              border border-slate-700
              text-slate-200
              text-xs
              rounded-lg
              px-3
              py-2
              focus:outline-none
              focus:border-cyan-500
              hover:border-slate-600
              transition
            "
          >
            {DAMS_DATA.map((d) => (
              <option
                key={d.id}
                value={d.id}
              >
                {d.name} ({d.state}) - {d.riskLevel}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ================================================= */}
      {/* MAP CONTAINER */}
      {/* ================================================= */}

      <div
        className="
          relative
          w-full
          h-[640px]
          min-h-[640px]
          overflow-hidden
          rounded-xl
          border
          border-slate-800
          bg-slate-950
        "
      >
        <FloodMap
          key={selectedDam?.id}
          selectedDam={selectedDam}
          center={[
            selectedDam.lat,
            selectedDam.lng,
          ]}
          zoom={9}
          height="640px"
        />
      </div>

      {/* ================================================= */}
      {/* MAP INFORMATION */}
      {/* ================================================= */}

      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">

        {/* HIGH VELOCITY */}
        <div
          className="
            min-w-0
            p-4
            rounded-xl
            bg-slate-900/80
            border border-slate-800
          "
        >
          <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase font-mono mb-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />

            <span>
              High-Velocity Surge Zone
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Red polygons represent modeled dam breach
            water velocity &gt; 3.0 m/s. Downstream river
            wards in Sambalpur, Burla, and Chiplima
            require immediate priority evacuation.
          </p>
        </div>

        {/* SHELTERS */}
        <div
          className="
            min-w-0
            p-4
            rounded-xl
            bg-slate-900/80
            border border-slate-800
          "
        >
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase font-mono mb-2">
            <Home className="w-4 h-4 shrink-0" />

            <span>
              Designated Relief Shelters
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Green shelter points are located above the
            100-year flood elevation (+35m to +50m high
            ground) equipped with solar power, purified
            water, and emergency food supplies.
          </p>
        </div>

        {/* EVACUATION */}
        <div
          className="
            min-w-0
            p-4
            rounded-xl
            bg-slate-900/80
            border border-slate-800
          "
        >
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase font-mono mb-2">
            <Navigation className="w-4 h-4 shrink-0" />

            <span>
              Safe Evacuation Corridors
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Green dashed lines display active safe
            corridors avoiding flooded low-ground highway
            underpasses and bridge approaches.
          </p>
        </div>

      </div>
    </div>
  );
}

export default LiveMap;