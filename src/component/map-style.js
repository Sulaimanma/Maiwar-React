export const dataLayer = {
  id: "unclustered-point",
  type: "circle",
  source: "heritages",
  filter: ["!", ["has", "point_count"]],
  paint: {
    "circle-color": "#11b4da",
    "circle-radius": 10,
    "circle-stroke-width": 1,
    "circle-stroke-color": "#fff",
  },
};
