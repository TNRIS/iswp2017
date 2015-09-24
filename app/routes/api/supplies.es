
import utils from 'lib/utils';
import ThemeDataController from 'controllers/themeData';

// TODO: /summary route
// TODO: Supplies for sourceId

const supplies = new ThemeDataController({
  theme: 'supplies',
  dataTable: 'vwMapExistingWugSupply',
  summaryTable: 'vwMapWugExistingSupplyA1'
});

export default utils.makeCommonDataRoutes(supplies);