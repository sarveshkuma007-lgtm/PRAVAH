/**
 * Maps Service for PRAVAH GIS
 * Provides tile layer definitions (Satellite, Dark Command, Terrain, Street)
 * and spatial boundary helpers for Indian dam river basins.
 */
export const mapsService = {
  TILE_LAYERS: {
    darkCommand: {
      name: "Dark Command Center",
      url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap',
    },
    satellite: {
      name: "High-Res Satellite",
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
    },
    terrain: {
      name: "Topographic & Contours",
      url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
    },
    standard: {
      name: "OpenStreetMap Standard",
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  },

  // Simulated breach flood inundation zones (coordinates for polygons)
  INUNDATION_ZONES: {
    hirakudSurgeZone: [
      [21.5704, 83.8711],
      [21.53, 83.91],
      [21.49, 83.97],
      [21.45, 83.99],
      [21.41, 84.03],
      [21.43, 83.91],
      [21.50, 83.85],
      [21.5704, 83.8711],
    ],
    moderateBufferZone: [
      [21.60, 83.83],
      [21.52, 84.05],
      [21.38, 84.10],
      [21.36, 83.85],
      [21.48, 83.78],
      [21.60, 83.83],
    ],
  },

  // River network paths
  RIVER_NETWORKS: [
    {
      name: "Mahanadi River Basin",
      coordinates: [
        [21.65, 83.75],
        [21.57, 83.87],
        [21.48, 83.95],
        [21.42, 84.02],
        [21.15, 84.35],
        [20.80, 84.80],
        [20.46, 85.87], // Cuttack
        [20.30, 86.60], // Bay of Bengal
      ],
      color: "#06b6d4",
    },
    {
      name: "Bhagirathi / Ganga River",
      coordinates: [
        [30.55, 78.85],
        [30.3781, 78.4803], // Tehri
        [30.14, 78.59], // Devprayag
        [30.08, 78.28], // Rishikesh
        [29.94, 78.16], // Haridwar
      ],
      color: "#38bdf8",
    },
    {
      name: "Narmada River",
      coordinates: [
        [21.95, 74.20],
        [21.8315, 73.7483], // Sardar Sarovar
        [21.70, 73.40],
        [21.60, 73.00],
        [21.68, 72.60], // Gulf of Khambhat
      ],
      color: "#0284c7",
    },
  ],
};
