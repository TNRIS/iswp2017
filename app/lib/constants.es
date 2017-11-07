export default {
  YEARS: ['2020', '2030', '2040', '2050', '2060', '2070'],
  VALUE_PREFIXES: {
    demands: 'D',
    needs: 'N',
    supplies: 'WS',
    strategies: 'SS',
    population: 'P'
  },
  DATA_TABLES: {
    demands: 'vw2017MapWugDemand',
    needs: 'vw2017MapWugNeeds',
    supplies: 'vw2017MapExistingWugSupply',
    population: 'vw2017MapWugPopulation',
    strategies: 'vw2017MapWMSWugSupply'
  },
  SOURCE_TABLES: {
    supplies: 'vw2017MapExistingWugSupply',
    strategies: 'vw2017MapWMSWugSupply'
  },
  PROJECT_TABLES: {
    strategies: 'vw2017MapWMSProjectByEntityWUGSplit',
    wms: 'vw2017MapWMSProjectByWMS'
  },
  API_CACHE_EXPIRES_IN: 60 * 60 * 24 * 1000
};
