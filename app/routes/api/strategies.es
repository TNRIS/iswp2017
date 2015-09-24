
import utils from 'lib/utils';
import ThemeDataController from 'controllers/themeData';

// TODO: /summary route
// TODO: Strategies for sourceId
// TODO: Strategies for strategyType
// TODO: Projects

// TODO: Strategies select has more columns than the others,
//  >> need a way to add these additional fields to the ThemeDataController

const strategies = new ThemeDataController({
  theme: 'strategies',
  dataTable: 'vwMapWugWms',
  summaryTable: 'vwMapWugWmsA1'
});

export default utils.makeCommonDataRoutes(strategies);