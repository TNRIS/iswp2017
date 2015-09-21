
import db from 'db';

import BaseController from 'controllers/base';

class DemandsController extends BaseController {
  constructor() {
    super({theme: 'demands'});
  }

  getDemands(request, reply) {
    const selectArgs = this.makeSelectArgs(request.params);
    db.select.apply(db, selectArgs)
      .from('vwMapWugDemand')
      .then((results) => {
        reply(results);
      });
  }

}

const controller = new DemandsController();
export default controller;