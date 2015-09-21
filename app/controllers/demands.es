
import BaseController from 'controllers/base';

class DemandsController extends BaseController {
  constructor() {
    super({
      table: 'vwMapWugDemand',
      theme: 'demands'
    });
  }

  getDemands(request, reply) {
    this.selectData(request.params)
      .then((results) => {
        reply(results);
      });
  }

  getDemandsForRegion(request, reply) {
    this.selectData(request.params)
      .where('WugRegion', request.params.regionLetter.toUpperCase())
      .then((results) => {
        reply(results);
      });
  }

  getDemandsForCounty(request, reply) {
    this.selectData(request.params)
      .where('WugCounty', request.params.county.toUpperCase())
      .then((results) => {
        reply(results);
      });
  }

  getDemandsForType(request, reply) {
    this.selectData(request.params)
      .where('WugType', request.params.type.toUpperCase())
      .then((results) => {
        reply(results);
      });
  }

  getDemandsForEntity(request, reply) {
    this.selectData(request.params)
      .where('EntityId', request.params.entityId)
      .then((results) => {
        reply(results);
      });
  }

}

const controller = new DemandsController();
export default controller;