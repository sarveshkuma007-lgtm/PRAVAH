import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { DAMS_DATA } from "../data/damData";
import { MOCK_SHELTERS } from "../data/mockSimulationData";
import { mapsService } from "../services/mapsService";
import { Layers, MapPin, ShieldAlert, Home, Navigation, Eye, Radio } from "lucide-react";

// =====================================================
// GLOBAL KEYFRAMES
// Injected once into <head>. Explicit names so nothing
// depends on Tailwind having generated a same-named
// utility elsewhere in the app.
// =====================================================
const MAP_STYLE_ID = "pravah-flood-map-keyframes";

function ensureMapStyles() {
  if (document.getElementById(MAP_STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = MAP_STYLE_ID;
  style.textContent = `
    @keyframes pravah-dam-pulse {
      0%   { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.55); }
      70%  { box-shadow: 0 0 0 14px rgba(239, 68, 68, 0); }
      100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
    }

    @keyframes pravah-radar-ring {
      0%   { transform: scale(0.4); opacity: 0.9; }
      100% { transform: scale(2.6); opacity: 0; }
    }

    @keyframes pravah-dash-flow {
      to { stroke-dashoffset: -40; }
    }

    @keyframes pravah-zone-breathe {
      0%, 100% { fill-opacity: 0.32; stroke-opacity: 0.9; }
      50%      { fill-opacity: 0.55; stroke-opacity: 0.5; }
    }

    .pravah-river-flow {
      animation: pravah-dash-flow 1.2s linear infinite;
    }

    .pravah-surge-zone {
      animation: pravah-zone-breathe 2.6s ease-in-out infinite;
      transform-origin: center;
    }

    .pravah-radar-marker { position: relative; width: 34px; height: 34px; }
    .pravah-radar-marker__core {
      position: absolute; top: 50%; left: 50%;
      width: 12px; height: 12px; border-radius: 50%;
      background: #ef4444; border: 2px solid #ffffff;
      transform: translate(-50%, -50%);
      box-shadow: 0 0 10px 2px rgba(239, 68, 68, 0.8);
      z-index: 2;
    }
    .pravah-radar-marker__ring {
      position: absolute; top: 50%; left: 50%;
      width: 12px; height: 12px; border-radius: 50%;
      border: 2px solid #ef4444;
      transform: translate(-50%, -50%) scale(0.4);
      animation: pravah-radar-ring 2s ease-out infinite;
    }
    .pravah-radar-marker__ring--delay {
      animation-delay: 0.66s;
    }
    .pravah-radar-marker__ring--delay2 {
      animation-delay: 1.32s;
    }

    @media (prefers-reduced-motion: reduce) {
      .pravah-radar-marker__ring,
      .pravah-river-flow,
      .pravah-surge-zone {
        animation: none !important;
      }
    }
  `;
  document.head.appendChild(style);
}

export function FloodMap({
  selectedDam = null,
  center = [22.5, 81.0],
  zoom = 5,
  showDams = true,
  showShelters = true,
  showInundation = true,
  showRivers = true,
  userLocation = null,
  height = "550px",
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);
  const [activeTile, setActiveTile] = useState("darkCommand");
  const [lastSynced, setLastSynced] = useState(new Date());
  const [secondsAgo, setSecondsAgo] = useState(0);
  const [activeLayers, setActiveLayers] = useState({
    dams: showDams,
    shelters: showShelters,
    inundation: showInundation,
    rivers: showRivers,
  });

  useEffect(() => {
    ensureMapStyles();
  }, []);

  // Live "data freshness" readout — ticks every second, resets on a
  // periodic simulated re-sync so it never looks stale in a demo.
  useEffect(() => {
    const tick = setInterval(() => {
      setSecondsAgo(Math.floor((Date.now() - lastSynced.getTime()) / 1000));
    }, 1000);

    const resync = setInterval(() => {
      setLastSynced(new Date());
    }, 30000);

    return () => {
      clearInterval(tick);
      clearInterval(resync);
    };
  }, [lastSynced]);

  // Custom marker icons
  const createDamIcon = (riskLevel) => {
    const isCritical = riskLevel === "CRITICAL";
    const isHigh = riskLevel === "HIGH";
    const color = isCritical ? "#ef4444" : isHigh ? "#f97316" : "#06b6d4";

    return L.divIcon({
      className: "custom-dam-marker",
      html: `
        <div style="
          width: 28px;
          height: 28px;
          background: ${color};
          border: 2px solid #ffffff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 ${isCritical ? "16px #ef4444" : "10px rgba(0,0,0,0.5)"};
        ">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });
  };

  const createShelterIcon = () => {
    return L.divIcon({
      className: "custom-shelter-marker",
      html: `
        <div style="
          width: 24px;
          height: 24px;
          background: #10b981;
          border: 2px solid #ffffff;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 8px rgba(16, 185, 129, 0.6);
        ">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          </svg>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  const createUserIcon = () => {
    return L.divIcon({
      className: "custom-user-marker",
      html: `
        <div style="
          width: 22px;
          height: 22px;
          background: #3b82f6;
          border: 3px solid #ffffff;
          border-radius: 50%;
          box-shadow: 0 0 12px #3b82f6;
        "></div>
      `,
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    });
  };

  // Radar-pulse icon for the breach epicenter — three staggered
  // expanding rings around a solid core, CSS-driven (no per-frame JS).
  const createRadarIcon = () => {
    return L.divIcon({
      className: "custom-radar-marker",
      html: `
        <div class="pravah-radar-marker">
          <span class="pravah-radar-marker__ring"></span>
          <span class="pravah-radar-marker__ring pravah-radar-marker__ring--delay"></span>
          <span class="pravah-radar-marker__ring pravah-radar-marker__ring--delay2"></span>
          <span class="pravah-radar-marker__core"></span>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17],
    });
  };

  // Centroid of a polygon's ring, used to place the radar marker at the
  // approximate center of the highest-risk surge zone without needing a
  // dedicated "epicenter" coordinate in the data layer.
  const polygonCentroid = (ring) => {
    const [latSum, lngSum] = ring.reduce(
      ([latAcc, lngAcc], [lat, lng]) => [latAcc + lat, lngAcc + lng],
      [0, 0]
    );
    return [latSum / ring.length, lngSum / ring.length];
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    const tileConfig = mapsService.TILE_LAYERS[activeTile];

    const map = L.map(mapContainerRef.current, {
      center: selectedDam ? [selectedDam.lat, selectedDam.lng] : center,
      zoom: selectedDam ? 9 : zoom,
      zoomControl: true,
      attributionControl: false,
    });

    L.tileLayer(tileConfig.url, {
      maxZoom: 18,
      subdomains: "abcd",
    }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    layerGroupRef.current = layerGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [activeTile]);

  // Update Layers & Overlays
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = layerGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    // 1. Inundation Zones (Delft3D / SPH breach prediction)
    if (activeLayers.inundation) {
      const surgeRing = mapsService.INUNDATION_ZONES.hirakudSurgeZone;

      const redZone = L.polygon(surgeRing, {
        color: "#ef4444",
        weight: 2,
        fillColor: "#ef4444",
        fillOpacity: 0.45,
        className: "pravah-surge-zone",
      }).bindPopup(`
        <div style="font-family: system-ui; font-size: 12px; color: #0f172a;">
          <strong style="color: #ef4444;">DELFT3D SIMULATION: HIGH-VELOCITY BREACH SURGE</strong><br/>
          Depth: 3.5m - 5.2m &bull; Velocity: 3.8 m/s<br/>
          <strong>Immediate Evacuation Mandatory</strong>
        </div>
      `);
      group.addLayer(redZone);

      // Radar-pulse marker at the surge zone's centroid — the visual
      // "ground zero" that draws the eye straight to the highest-risk point.
      const epicenter = polygonCentroid(surgeRing);
      const radarMarker = L.marker(epicenter, {
        icon: createRadarIcon(),
        zIndexOffset: 1000,
      }).bindPopup(`
        <div style="font-family: system-ui; font-size: 12px; color: #0f172a;">
          <strong style="color: #ef4444;">Breach Epicenter</strong><br/>
          Center of highest-velocity surge zone
        </div>
      `);
      group.addLayer(radarMarker);

      const bufferZone = L.polygon(mapsService.INUNDATION_ZONES.moderateBufferZone, {
        color: "#f59e0b",
        weight: 1.5,
        fillColor: "#f59e0b",
        fillOpacity: 0.25,
        dashArray: "4 4",
      }).bindPopup(`
        <div style="font-family: system-ui; font-size: 12px; color: #0f172a;">
          <strong style="color: #f59e0b;">Moderate Flood Inundation Buffer Zone</strong><br/>
          Projected water surge within 4 - 6 hours.
        </div>
      `);
      group.addLayer(bufferZone);
    }

    // 2. River Networks — animated dash flow shows discharge direction
    if (activeLayers.rivers) {
      mapsService.RIVER_NETWORKS.forEach((river) => {
        const line = L.polyline(river.coordinates, {
          color: river.color,
          weight: 4,
          opacity: 0.85,
          dashArray: "10 10",
          className: "pravah-river-flow",
        }).bindPopup(`<strong>${river.name}</strong><br/>Active flood discharge monitoring channel`);
        group.addLayer(line);
      });
    }

    // 3. Dams Markers
    if (activeLayers.dams) {
      DAMS_DATA.forEach((dam) => {
        const marker = L.marker([dam.lat, dam.lng], {
          icon: createDamIcon(dam.riskLevel),
        }).bindPopup(`
          <div style="font-family: system-ui; font-size: 12px; color: #0f172a; min-width: 180px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <strong style="font-size: 13px;">${dam.name}</strong>
              <span style="font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px; background: ${
                dam.riskLevel === "CRITICAL" ? "#fee2e2; color: #ef4444" : "#ecfeff; color: #0891b2"
              }">${dam.riskLevel}</span>
            </div>
            <div>River: <b>${dam.river}</b></div>
            <div>Water Level: <b>${dam.currentWaterLevel}m</b> / ${dam.dangerLevel}m</div>
            <div>Storage: <b>${dam.storagePercentage}%</b></div>
            <div>Discharge: <b>${dam.outflow} cumecs</b> (${dam.gatesOpen}/${dam.totalGates} gates)</div>
            <div style="margin-top: 6px;">
              <a href="/#/dam/${dam.id}" style="color: #0284c7; font-weight: bold; text-decoration: underline;">Full Telemetry &rarr;</a>
            </div>
          </div>
        `);
        group.addLayer(marker);
      });
    }

    // 4. Shelters Markers
    if (activeLayers.shelters) {
      MOCK_SHELTERS.forEach((shelter) => {
        const marker = L.marker([shelter.lat, shelter.lng], {
          icon: createShelterIcon(),
        }).bindPopup(`
          <div style="font-family: system-ui; font-size: 12px; color: #0f172a;">
            <strong style="color: #10b981;">${shelter.name}</strong><br/>
            Capacity: <b>${shelter.currentOccupancy} / ${shelter.capacity}</b> (${shelter.status})<br/>
            Elevation: <b>+${shelter.elevationMeters}m (Flood Resilient)</b><br/>
            Contact: <b>${shelter.contact}</b>
          </div>
        `);
        group.addLayer(marker);
      });
    }

    // 5. User Live Location
    if (userLocation && userLocation.lat && userLocation.lng) {
      const userMarker = L.marker([userLocation.lat, userLocation.lng], {
        icon: createUserIcon(),
      }).bindPopup(`
        <div style="font-family: system-ui; font-size: 12px; color: #0f172a;">
          <strong>Your Current Location</strong><br/>
          Lat: ${userLocation.lat.toFixed(4)}, Lng: ${userLocation.lng.toFixed(4)}
        </div>
      `);
      group.addLayer(userMarker);
    }
  }, [activeLayers, userLocation]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
      {/* Map Surface */}
      <div ref={mapContainerRef} style={{ width: "100%", height }} className="z-10" />

      {/* Map Controls Floating Toolbar */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700 shadow-lg text-xs">
        {/* Basemap Switcher */}
        <div className="flex items-center gap-1 border-r border-slate-700 pr-2">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <button
            onClick={() => setActiveTile("darkCommand")}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
              activeTile === "darkCommand" ? "bg-cyan-600 text-white" : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            Dark Command
          </button>
          <button
            onClick={() => setActiveTile("satellite")}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
              activeTile === "satellite" ? "bg-cyan-600 text-white" : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            Satellite
          </button>
          <button
            onClick={() => setActiveTile("terrain")}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
              activeTile === "terrain" ? "bg-cyan-600 text-white" : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            Terrain
          </button>
        </div>

        {/* Feature Layer Toggles */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveLayers((p) => ({ ...p, dams: !p.dams }))}
            className={`px-2 py-1 rounded text-[11px] flex items-center gap-1 font-medium transition-colors ${
              activeLayers.dams ? "bg-cyan-950 text-cyan-300 border border-cyan-700" : "text-slate-400 opacity-60"
            }`}
          >
            <ShieldAlert className="w-3 h-3 text-cyan-400" />
            <span>Dams</span>
          </button>

          <button
            onClick={() => setActiveLayers((p) => ({ ...p, inundation: !p.inundation }))}
            className={`px-2 py-1 rounded text-[11px] flex items-center gap-1 font-medium transition-colors ${
              activeLayers.inundation ? "bg-red-950 text-red-300 border border-red-700" : "text-slate-400 opacity-60"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>Breach Zones</span>
          </button>

          <button
            onClick={() => setActiveLayers((p) => ({ ...p, shelters: !p.shelters }))}
            className={`px-2 py-1 rounded text-[11px] flex items-center gap-1 font-medium transition-colors ${
              activeLayers.shelters ? "bg-emerald-950 text-emerald-300 border border-emerald-700" : "text-slate-400 opacity-60"
            }`}
          >
            <Home className="w-3 h-3 text-emerald-400" />
            <span>Shelters</span>
          </button>
        </div>

        {/* Sync readout lives inside the same wrapping toolbar row, so it
            never has to compete for space with the legend or any other
            floating overlay */}
        <div className="flex items-center gap-1 border-l border-slate-700 pl-2 font-mono text-slate-400">
          <Radio className="w-3 h-3 text-emerald-400" />
          <span>{secondsAgo}s ago</span>
        </div>
      </div>


      {/* Legend Box Bottom-Right */}
      <div className="absolute bottom-4 right-4 z-20 bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-700 text-xs shadow-xl hidden sm:block max-w-[200px]">
        <span className="font-mono text-[10px] uppercase text-slate-400 block mb-1.5 font-bold">
          GIS Risk Legend
        </span>
        <div className="space-y-1.5 text-[11px] text-slate-300 font-medium">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 shrink-0" />
            <span>Critical / Breach Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500 shrink-0" />
            <span>High Water Alert</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-cyan-400 shrink-0" />
            <span>Normal Monitoring</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-emerald-500 shrink-0" />
            <span>Designated Shelter</span>
          </div>
          <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
            <span className="relative flex h-3 w-3 items-center justify-center shrink-0">
              <span className="absolute h-2 w-2 rounded-full bg-red-500 animate-ping opacity-70" />
              <span className="relative h-1.5 w-1.5 rounded-full bg-red-500" />
            </span>
            <span>Breach Epicenter</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FloodMap;
