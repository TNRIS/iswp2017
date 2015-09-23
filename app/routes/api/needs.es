
import utils from 'lib/utils';
import PlanningDataController from 'controllers/planningData';

const needsController = new PlanningDataController({
  theme: 'needs',
  table: 'vwMapWugNeeds'
});

export default utils.makeCommonDataRoutes(needsController);