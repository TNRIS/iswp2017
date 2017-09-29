
export default {
  API_BASE: '/api/v1',
  THEMES: ['demands', 'supplies', 'needs', 'strategies'],
  SRC_THEMES: ['supplies', 'strategies'],
  PRJ_THEMES: ['strategies'],
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
  WMS_TYPES: [
    'AQUIFER STORAGE & RECOVERY',
    'CONJUNCTIVE USE',
    'DIRECT POTABLE REUSE',
    'DROUGHT MANAGEMENT',
    'GROUNDWATER DESALINATION',
    'GROUNDWATER WELLS & OTHER',
    'INDIRECT REUSE',
    'IRRIGATION CONSERVATION',
    'MUNICIPAL CONSERVATION',
    'NEW MAJOR RESERVOIR',
    'OTHER CONSERVATION',
    'OTHER DIRECT REUSE',
    'OTHER STRATEGIES',
    'OTHER SURFACE WATER',
    'SEAWATER DESALINATION'
  ],
  WMS_TYPE_DESCRIPTIONS: {
    'AQUIFER STORAGE & RECOVERY': "Aquifer storage and recovery water management strategies inject water, when available, into an aquifer where it is stored for later use.",
    'CONJUNCTIVE USE': "Conjunctive use water management strategies combine multiple water sources, usually surface water and groundwater, to optimize the beneficial characteristics of each source, yielding additional firm water supplies.",
    'DIRECT POTABLE REUSE': "Direct potable reuse strategies involve taking treated wastewater effluent, further treating it at an advanced water treatment plant, and then either introducing it upfront of the water treatment plant or directly into the potable water distribution system.",
    'DROUGHT MANAGEMENT': "Drought management water management strategies reduce water use during times of drought by temporarily restricting certain economic and domestic activities such as car washing and lawn watering.",
    'GROUNDWATER DESALINATION': "Groundwater desalination water management strategies involve the process of removing dissolved solids from brackish groundwater, often by forcing the source water through membranes under high pressure.",
    'GROUNDWATER WELLS & OTHER': "Groundwater wells & other water management strategies include the development of additional groundwater including single wells or multiple wells, which may be part of the development of new well fields or existing well fields.",
    'INDIRECT REUSE': "Indirect reuse water management strategies generally involve discharging wastewater into a natural water body and diverting that water for subsequent use.",
    'IRRIGATION CONSERVATION': "Irrigation conservation water management strategies include a variety of activities that either reduce everyday water consumption or increase water use efficiency, allowing more to be done with the same amount of water. Irrigation conservation activities include water savings associated with changes to irrigation methods and equipment, for example, conversion to Low Energy Precision Application systems and other irrigation best management practices.",
    'MUNICIPAL CONSERVATION': "Municipal conservation water management strategies include a variety of activities that either reduce everyday water consumption or increase water use efficiency, allowing more to be done with the same amount of water. Examples of municipal conservation includes activities such as low flow plumbing fixtures, water conservation pricing structure, water system audits, or landscape irrigation restrictions.",
    'NEW MAJOR RESERVOIR': "New major reservoir water management strategies involve the construction of a new major reservoir. Major reservoirs are defined as reservoirs having at least 5,000 acre-feet of storage capacity at the normal operating level.",
    'OTHER CONSERVATION': "Other conservation water management strategies include a variety of activities that either reduce everyday water consumption or increase water use efficiency of water use categories other than municipal and irrigation, allowing more to be done with the same amount of water. Steam-electric, manufacturing, and mining conservation activities are based on best management practices, which may include evaluating cooling and process water practices, water audits, or submetering.",
    'OTHER DIRECT REUSE': "Other direct reuse water management strategies generally convey treated wastewater directly from a treatment plant to non-potable uses such as landscaping or industrial processes.",
    'OTHER STRATEGIES': "Other water management strategies individually, provide less than 0.5 percent of the total recommended strategy supplies in 2070. They include surface water desalination, weather modification, brush control, and rainwater harvesting.",
    'OTHER SURFACE WATER': "Other surface water management strategies includes minor reservoirs (less than 5,000 acre-feet of storage) and subordination as well as a wide variety of other strategies that convey, treat, reassign, or otherwise make accessible additional surface water supplies to users with or without additional infrastructure.",
    'SEAWATER DESALINATION': "Seawater desalination water management strategies involve the process of removing dissolved solids from seawater, often by forcing the source water through membranes under high pressure."
  },
  DECADES: ['2020', '2030', '2040', '2050', '2060', '2070'],
  REGIONS: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'],
  LONG_NAME_THRESHOLD: 18,
  BASE_MAP_LAYER: {
    url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_nolabels/{z}/{x}/{y}.png',
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
  THEME_BOUNDARY_LAYER_STYLE: {
    fillOpacity: 0.1,
    opacity: 1,
    color: '#cc9200',
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
  DATA_TABLE_ITEMS_PER_PAGE: 20,
  GROUNDWATER_SOURCE: {
    fillColor: '#0B3A71',
    color: '#AFBFD0',
    weight: 2,
    opacity: .8,
    fillOpacity: 0.8
  },
  SURFACEWATER_SOURCE: {
    color: '#007DFF',
    weight: 2,
    opacity: 1,
    fillOpacity: 1
  },
  ISNEW_SOURCE: {
    color: '#00EDFF',
    weight: 2,
    opacity: 1,
    fillOpacity: 1
  },
  RIVERWATER_SOURCE: {
    color: '#33B0FF',
    weight: 2,
    opacity: 1
  }
};
