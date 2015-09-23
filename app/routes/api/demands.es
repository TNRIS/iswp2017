
import utils from 'lib/utils';
import PlanningDataController from 'controllers/planningData';

const demandsController = new PlanningDataController({
  theme: 'demands',
  table: 'vwMapWugDemand'
});

export default utils.makeCommonDataRoutes(demandsController);