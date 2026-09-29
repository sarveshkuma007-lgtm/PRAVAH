import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { useLocation } from "../hooks/useLocation";
import {
  Navigation,
  Route,
  Loader2,
  MapPin,
} from "lucide-react";

export function LiveLocationMap({ height = "450px" }) {
  const {
    location,
    nearestShelter,
    loading,
  } = useLocation();

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const routeLayerRef = useRef(null);

  const [routeLoading, setRouteLoading] = useState(false);
  const [routeInfo, setRouteInfo] = useState(null);
  const [routeError, setRouteError] = useState("");

  /*
   * =========================================================
   * GET REAL ROAD ROUTE FROM OSRM
   * No API key required.
   * =========================================================
   */
  const getRoadRoute = async (map) => {
    if (!location || !nearestShelter) return;

    setRouteLoading(true);
    setRouteError("");

    try {
      const start = `${location.lng},${location.lat}`;
      const end = `${nearestShelter.lng},${nearestShelter.lat}`;

      const url =
        `https://router.project-osrm.org/route/v1/driving/` +
        `${start};${end}` +
        `?overview=full&geometries=geojson&steps=true`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Routing service unavailable");
      }

      const data = await response.json();

      if (
        data.code !== "Ok" ||
        !data.routes ||
        !data.routes.length
      ) {
        throw new Error("No road route found");
      }

      const route = data.routes[0];

      /*
       * Remove previous route
       */
      if (routeLayerRef.current) {
        map.removeLayer(routeLayerRef.current);
        routeLayerRef.current = null;
      }

      /*
       * Draw REAL ROAD ROUTE
       */
      routeLayerRef.current = L.geoJSON(
        {
          type: "Feature",
          properties: {},
          geometry: route.geometry,
        },
        {
          style: {
            color: "#16a34a",
            weight: 6,
            opacity: 0.9,
            lineCap: "round",
            lineJoin: "round",
          },
        }
      ).addTo(map);

      /*
       * Add highlighted inner line
       */
      L.geoJSON(
        {
          type: "Feature",
          properties: {},
          geometry: route.geometry,
        },
        {
          style: {
            color: "#bbf7d0",
            weight: 2,
            opacity: 0.9,
            dashArray: "6 8",
          },
        }
      ).addTo(map);

      /*
       * Route information
       */
      setRouteInfo({
        distance:
          (route.distance / 1000).toFixed(1),
        duration:
          Math.round(route.duration / 60),
      });

      /*
       * Fit map to REAL ROAD ROUTE
       */
      const routeBounds =
        L.geoJSON({
          type: "Feature",
          properties: {},
          geometry: route.geometry,
        }).getBounds();

      map.fitBounds(routeBounds, {
        padding: [60, 60],
      });

    } catch (error) {
      console.error("OSRM routing error:", error);
      setRouteError(
        "Road route unavailable. Showing direct evacuation corridor."
      );

      /*
       * Fallback route
       */
      const fallback = [
        [location.lat, location.lng],
        [nearestShelter.lat, nearestShelter.lng],
      ];

      routeLayerRef.current = L.polyline(
        fallback,
        {
          color: "#f59e0b",
          weight: 5,
          dashArray: "8 8",
          opacity: 0.85,
        }
      ).addTo(map);

      const bounds = L.latLngBounds(fallback);

      map.fitBounds(bounds, {
        padding: [60, 60],
      });
    } finally {
      setRouteLoading(false);
    }
  };

  /*
   * =========================================================
   * CREATE MAP
   * =========================================================
   */
  useEffect(() => {
    if (!mapContainerRef.current || !location) {
      return;
    }

    /*
     * Remove previous map
     */
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: [location.lat, location.lng],
      zoom: 7,
      zoomControl: true,
      attributionControl: true,
    });

    /*
     * =======================================================
     * OPENSTREETMAP
     * No API key required
     * =======================================================
     */
    L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
      }
    ).addTo(map);

    /*
     * =======================================================
     * USER LOCATION
     * =======================================================
     */

    const userIcon = L.divIcon({
      className: "pravah-user-marker",
      html: `
        <div style="
          width:24px;
          height:24px;
          background:#2563eb;
          border:4px solid #ffffff;
          border-radius:50%;
          box-shadow:
            0 0 0 5px rgba(37,99,235,0.18),
            0 3px 10px rgba(0,0,0,0.25);
        "></div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    L.marker(
      [location.lat, location.lng],
      {
        icon: userIcon,
        zIndexOffset: 1000,
      }
    )
      .addTo(map)
      .bindPopup(`
        <div style="
          font-family:Arial,sans-serif;
          min-width:160px;
        ">
          <strong>Your Location</strong>
          <br/>
          <span style="color:#64748b;font-size:12px;">
            ${location.name || "Live GPS Location"}
          </span>
        </div>
      `);

    /*
     * =======================================================
     * SHELTER MARKER
     * =======================================================
     */

    if (nearestShelter) {
      const shelterIcon = L.divIcon({
        className: "pravah-shelter-marker",
        html: `
          <div style="
            width:32px;
            height:32px;
            background:#16a34a;
            border:3px solid #ffffff;
            border-radius:9px;
            display:flex;
            align-items:center;
            justify-content:center;
            box-shadow:
              0 3px 12px rgba(0,0,0,0.25);
          ">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M3 10.5L12 3l9 7.5"/>
              <path d="M5 9.5V21h14V9.5"/>
              <path d="M9 21v-6h6v6"/>
            </svg>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      L.marker(
        [
          nearestShelter.lat,
          nearestShelter.lng,
        ],
        {
          icon: shelterIcon,
        }
      )
        .addTo(map)
        .bindPopup(`
          <div style="
            font-family:Arial,sans-serif;
            min-width:200px;
            line-height:1.5;
          ">
            <strong>
              ${nearestShelter.name}
            </strong>

            <br/>

            <span style="color:#16a34a;font-size:12px;">
              ✓ Designated Safe Shelter
            </span>

            <hr style="
              border:0;
              border-top:1px solid #e2e8f0;
              margin:7px 0;
            "/>

            <span style="font-size:12px;">
              Elevation:
              +${nearestShelter.elevationMeters}m
            </span>

            <br/>

            <span style="font-size:12px;">
              Capacity:
              ${nearestShelter.currentOccupancy}/
              ${nearestShelter.capacity}
            </span>
          </div>
        `);
    }

    mapInstanceRef.current = map;

    /*
     * Force Leaflet to recalculate dimensions
     */
    setTimeout(() => {
      map.invalidateSize();

      if (nearestShelter) {
        getRoadRoute(map);
      }
    }, 300);

    return () => {
      if (routeLayerRef.current) {
        routeLayerRef.current = null;
      }

      map.remove();
      mapInstanceRef.current = null;
    };
  }, [location, nearestShelter]);

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

      {/* =====================================================
          MAP
      ====================================================== */}

      <div
        ref={mapContainerRef}
        style={{
          width: "100%",
          height,
        }}
      />

      {/* =====================================================
          LOADING LOCATION
      ====================================================== */}

      {loading && (
        <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-md">
            <Loader2 className="h-4 w-4 animate-spin text-blue-600" />

            <span className="text-xs font-semibold text-slate-700">
              Detecting your location...
            </span>
          </div>
        </div>
      )}

      {/* =====================================================
          ROUTE INFO
      ====================================================== */}

      <div className="absolute top-3 left-3 z-[500] max-w-[310px] rounded-xl border border-slate-200 bg-white/95 p-3 shadow-md backdrop-blur-sm">

        <div className="flex items-center gap-2">

          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50">
            {routeLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-green-600" />
            ) : (
              <Route className="h-4 w-4 text-green-600" />
            )}
          </div>

          <div>
            <p className="text-xs font-bold text-slate-900">
              Real Road Evacuation Route
            </p>

            <p className="text-[10px] font-semibold text-green-600">
              {routeLoading
                ? "Calculating road route..."
                : "Route Active"}
            </p>
          </div>
        </div>

        {routeInfo && (
          <div className="mt-2 flex gap-3 border-t border-slate-100 pt-2">

            <div>
              <p className="text-[9px] uppercase text-slate-400">
                Distance
              </p>

              <p className="text-xs font-bold text-slate-800">
                {routeInfo.distance} km
              </p>
            </div>

            <div>
              <p className="text-[9px] uppercase text-slate-400">
                Est. Time
              </p>

              <p className="text-xs font-bold text-slate-800">
                {routeInfo.duration >= 60
                  ? `${Math.floor(routeInfo.duration / 60)}h ${
                      routeInfo.duration % 60
                    }m`
                  : `${routeInfo.duration} min`}
              </p>
            </div>

          </div>
        )}

        <p className="mt-2 text-[10px] leading-relaxed text-slate-500">
          Road-based route to{" "}
          <span className="font-semibold text-slate-800">
            {nearestShelter?.name || "nearest shelter"}
          </span>
          .
        </p>

        {routeError && (
          <p className="mt-2 rounded-md bg-amber-50 px-2 py-1.5 text-[9px] font-medium text-amber-700">
            {routeError}
          </p>
        )}
      </div>

      {/* =====================================================
          LEGEND
      ====================================================== */}

      <div className="absolute bottom-3 left-3 z-[500] rounded-lg border border-slate-200 bg-white/95 px-3 py-2 shadow-sm backdrop-blur-sm">

        <div className="flex items-center gap-3">

          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full border-2 border-white bg-blue-600 shadow-sm" />
            <span className="text-[10px] font-medium text-slate-600">
              Your Location
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-green-600 border-2 border-white shadow-sm" />
            <span className="text-[10px] font-medium text-slate-600">
              Shelter
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="h-[3px] w-5 rounded bg-green-600" />
            <span className="text-[10px] font-medium text-slate-600">
              Road Route
            </span>
          </div>

        </div>
      </div>

    </div>
  );
}

export default LiveLocationMap;