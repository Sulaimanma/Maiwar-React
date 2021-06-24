export const clusterLayer = {
  id: "clusters",
  type: "circle",
  source: "heritages",
  filter: ["has", "point_count"],
  paint: {
    "circle-color": [
      "step",
      ["get", "point_count"],
      "#51bbd6",
      100,
      "#f1f075",
      750,
      "#f28cb1",
    ],
    "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
  },
}

export const clusterCountLayer = {
  id: "cluster-count",
  type: "symbol",
  source: "heritages",
  filter: ["has", "point_count"],
  layout: {
    "text-field": "{point_count_abbreviated}",
    "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
    "text-size": 12,
  },
}

const color = "11b4da"
export const unclusteredPointLayer = {
  id: "unclusteredPointLayer",
  type: "symbol",
  source: "heritages",
  minzoom: 0,
  maxzoom: 22,
  // minzoom: 6,
  // maxzoom: 22,
  layout: {
    "icon-image": ["get", "heritageType"], // reference the image
    "icon-size": 1,
    "icon-offset": [0, -15],
    // "text-field": ["get", "visibility"],
    // "text-variable-anchor": ["top", "bottom", "left", "right"],
    // "text-radial-offset": 0.5,
    // "text-justify": "auto",

    // "text-font": ["DIN Offc Pro Bold", "Arial Unicode MS Bold"],
    // "text-size": 14,
  },
  paint: {
    "text-color": "white",
  },
}
export const mapRasterLayer = {
  id: "mapRaster",
  type: "raster",
  source: "mapRaster",

  paint: { "raster-opacity": 1 },
}

export const PCCCIconsLayer = {
  id: "PCCCIconsLayer",
  type: "symbol",
  source: "PCCC",
  minzoom: 0,
  maxzoom: 22,
  // minzoom: 6,
  // maxzoom: 22,
  layout: {
    "icon-image": ["get", "Icon"], // reference the image
    "icon-size": 1,
    "icon-offset": [0, -15],
    "text-field": ["get", "title"],
    "text-variable-anchor": ["top", "bottom", "left", "right"],
    "text-radial-offset": 0.5,
    "text-justify": "auto",
    // "text-field": "{point_count_abbreviated}",
    "text-font": ["DIN Offc Pro Bold", "Arial Unicode MS Bold"],
    "text-size": 14,
  },
  paint: {
    "text-color": "white",
  },
}
