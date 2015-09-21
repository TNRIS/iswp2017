
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

  getDemandsForRegion(request, reply) {
    const selectArgs = this.makeSelectArgs(request.params);
    db.select.apply(db, selectArgs)
      .from('vwMapWugDemand')
      .where('WugRegion', request.params.regionLetter.toUpperCase())
      .then((results) => {
        reply(results);
      });
  }

  getDemandsForCounty(request, reply) {
    const selectArgs = this.makeSelectArgs(request.params);
    db.select.apply(db, selectArgs)
      .from('vwMapWugDemand')
      .where('WugCounty', request.params.county.toUpperCase())
      .then((results) => {
        reply(results);
      });
  }

}

const controller = new DemandsController();
export default controller;