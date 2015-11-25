
export default {
  API_BASE: '/api/v1',
  //TODO: add strategies once DB view is ready, ref #51
  THEMES: ['demands', 'supplies', 'needs', /*'strategies'*/],
  THEME_TITLES: {
    'demands': 'Demands',
    'supplies': 'Existing Supplies',
    'needs': 'Needs (Potential Shortages)',
    // 'strategies': 'Strategy Supplies'
  },
  USAGE_TYPES: [
    'IRRIGATION',
    'MUNICIPAL',
    'MANUFACTURING',
    'STEAM ELECTRIC POWER',
    'LIVESTOCK',
    'MINING'
  ],
  DECADES: ['2020', '2030', '2040', '2050', '2060', '2070'],
  REGIONS: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'],
  BASE_MAP_LAYER: {
    url: 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    options: {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
    }
  },
  VIEW_MAP_PADDING: [500, 0],
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
    maxZoom: 12,
    minZoom: 5,
    maxBounds: [[15, -150], [45, -50]]
  },
  NEEDS_LEGEND_CLASSES: [
    {limit: 10, color: '#1A9641'}, //green
    {limit: 25, color: '#FFFFBF'},
    {limit: 50, color: '#FDAE61'},
    {limit: 100, color: 'rgb(237, 27, 47)'} //red
  ]
};
