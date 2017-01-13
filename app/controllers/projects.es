
import Hoek from 'hoek';

import db from 'db';
import {handleApiError} from 'lib/utils';

const projectTable = 'vw2017MapWMSProjects';


class ProjectsController {
  getAll(request, reply) {
    db.select().from(projectTable).orderBy('WMSProjectId')
      .then(reply)
      .catch(handleApiError(reply));
  }

  getByNamePartial(request, reply) {
    Hoek.assert(request.query.name, 'request.query.name is required');

    const nameQuery = '%' + request.query.name + '%';
    const startsWithName = request.query.name + '%';

    db.select().from(projectTable)
      .where('ProjectName', 'like', nameQuery)
      .orderByRaw(`CASE WHEN ProjectName LIKE "${startsWithName}" THEN 1 ELSE 2 END`)
      .limit(255)
      .then(reply)
      .catch(handleApiError(reply));
  }

  getOne(request, reply) {
    Hoek.assert(request.params.projectId, 'request.params.projectId is required');

    db.select().from(projectTable)
      .where('WMSProjectId', request.params.projectId)
      .limit(1)
      .then(reply)
      .catch(handleApiError(reply));
  }

  getInRegion(request, reply) {
    Hoek.assert(request.params.regionLetter, 'request.params.regionLetter is required');

    db.select().from(projectTable)
      .where('WMSProjectSponsorRegion', request.params.regionLetter.toUpperCase())
      .then(reply)
      .catch(handleApiError(reply));
  }
}

export default ProjectsController;