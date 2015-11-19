//TODO: Try to figure out a way to get this from the app constants?

export default {
  API_BASE: '/api/v1',
  THEMES: ['demands', 'supplies', 'needs', 'strategies'],
  THEME_TITLES: {
    'demands': 'Demands',
    'supplies': 'Existing Supplies',
    'needs': 'Needs (Potential Shortages)',
    'strategies': 'Strategy Supplies'
  },
  THEME_KEYS: {
    'demands': 'D',
    'supplies': 'WS',
    'needs': 'N',
    'strategies': 'SS'
  },
  USAGE_TYPES: [
    'IRRIGATION',
    'MUNICIPAL',
    'MANUFACTURING',
    'STEAM-ELECTRIC',
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
  }
};
