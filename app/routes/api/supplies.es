
import utils from 'lib/utils';
import ThemeDataController from 'controllers/themeData';

// TODO: /summary route
// TODO: Supplies for sourceId

const supplies = new ThemeDataController({
  theme: 'supplies',
  table: 'vwMapExistingWugSupply'
});

export default utils.makeCommonDataRoutes(supplies);