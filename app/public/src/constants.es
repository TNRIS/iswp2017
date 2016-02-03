
export default {
  API_BASE: '/api/v1',
  THEMES: ['demands', 'supplies', 'needs', 'strategies'],
  THEME_TITLES: {
    demands: 'Demands',
    supplies: 'Existing Supplies',
    needs: 'Needs (Potential Shortages)',
    strategies: 'Strategy Supplies',
    population: 'Population'
  },
  USAGE_TYPES: [
    'IRRIGATION',
    'MUNICIPAL',
    'MANUFACTURING',
    'STEAM ELECTRIC POWER',
    'LIVESTOCK',
    'MINING'
  ],
  USAGE_TYPE_DESCRIPTIONS: {
    IRRIGATION: "Irrigation water demand includes water used in irrigated field crops, vineyards, orchards, and self-supplied golf courses.",
    MUNICIPAL: "Municipal water demand consists of water to be used for residential (single family and multi-family), commercial (including some manufacturing firms that do not use water in their production process), and institutional purposes (establishments dedicated to public service).",
    MANUFACTURING: "Manufacturing water demand consists of the future water necessary for large facilities including those that process chemicals, oil and gas, food, paper, and other materials.",
    'STEAM ELECTRIC POWER': "Steam-electric water demand consists of water used for the purpose of generating power.",
    LIVESTOCK: "Livestock water demand includes water used in the production of various types of livestock including cattle (beef and dairy), hogs, poultry, horses, sheep, and goats.",
    MINING: "Mining water demand consists of water used in the exploration, development, and extraction of oil, gas, coal, aggregates, and other materials."
  },
  DECADES: ['2020', '2030', '2040', '2050', '2060', '2070'],
  REGIONS: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'],
  LONG_NAME_THRESHOLD: 18,
  BASE_MAP_LAYER: {
    url: 'http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png',
    options: {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
    }
  },
  DEFAULT_MAP_BOUNDS: [[36.5, -106.65], [25.84, -93.51]],
  BOUNDARY_LAYER_STYLE: {
    fillOpacity: 0.1,
    opacity: 1,
    color: '#3F556D',
    weight: 4
  },
  MIN_ENTITY_POINT_RADIUS: 4,
  MAX_ENTITY_POINT_RADIUS: 12,
  VIEW_MAP_OPTIONS: {
    scrollWheelZoom: false,
    zoomControl: false,
    maxZoom: 10,
    minZoom: 5,
    maxBounds: [[15, -150], [45, -50]]
  },
  NEEDS_LEGEND_CLASSES: [
    {limit: 10, color: '#84D68C'}, //green
    {limit: 25, color: '#FFFFBF'},
    {limit: 50, color: '#FDAE61'},
    {limit: 100, color: 'rgb(237, 27, 47)'} //red
  ],
  DATA_TABLE_ITEMS_PER_PAGE: 20
};
