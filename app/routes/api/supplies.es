
import utils from 'lib/utils';
import PlanningDataController from 'controllers/planningData';

const supplies = new PlanningDataController({
  theme: 'supplies',
  table: 'vwMapExistingWugSupply'
});

export default utils.makeCommonDataRoutes(supplies);