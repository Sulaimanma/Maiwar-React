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
  id: "unclustered-point",
  type: "circle",
  source: "heritages",
  filter: ["!", ["has", "point_count"]],
  paint: {
    "circle-color": "green",
    "circle-radius": 10,
    "circle-stroke-width": 4,
    "circle-stroke-color": "#fff",
  },
}
export const mapRasterLayer = {
  id: "mapRaster",
  type: "raster",
  source: "mapRaster",

  paint: { "raster-opacity": 1 },
}
