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

  minzoom: 6,
  maxzoom: 22,
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
  minzoom: 6,
  maxzoom: 22,
  paint: { "raster-opacity": 1 },
}

export const PCCCIconsLayer = {
  id: "PCCCIconsLayer",
  type: "symbol",
  source: "PCCC",
  minzoom: 7,
  maxzoom: 22,
  // minzoom: 6,
  // maxzoom: 22,
  layout: {
    "icon-image": ["get", "Icon"], // reference the image
    "icon-size": 1,
    "icon-offset": [0, -15],
    "text-field": ["get", "Icon"],
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
export const ThreeDBuildingLayer = {
  id: "add-3d-buildings",
  source: "composite",
  "source-layer": "building",
  filter: ["==", "extrude", "true"],
  type: "fill-extrusion",
  minzoom: 15,
  paint: {
    "fill-extrusion-color": "#aaa",

    // Use an 'interpolate' expression to
    // add a smooth transition effect to
    // the buildings as the user zooms in.
    "fill-extrusion-height": [
      "interpolate",
      ["linear"],
      ["zoom"],
      15,
      0,
      15.05,
      ["get", "height"],
    ],
    "fill-extrusion-base": [
      "interpolate",
      ["linear"],
      ["zoom"],
      15,
      0,
      15.05,
      ["get", "min_height"],
    ],
    "fill-extrusion-opacity": 1,
  },
}

export const boundriesLayer = {
  id: "route",
  type: "line",
  source: "boundtries",
  layout: {
    "line-join": "round",
    "line-cap": "round",
  },
  paint: {
    // "line-color": " #5F9F8C",
    "line-color": "#e8ebbd",
    "line-width": 2,
  },
}

export const regionName = {
  id: "regionName",
  type: "symbol",
  source: "regions",
  minzoom: 3,
  maxzoom: 14,
  layout: {
    // "icon-offset": [0, -15],
    "text-field": ["get", "name"],
    "text-variable-anchor": ["top", "bottom", "left", "right"],
    "text-radial-offset": 0.5,
    "text-justify": "auto",

    "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
    "text-size": 17,
  },
  paint: {
    "text-color": "white",
  },
}
