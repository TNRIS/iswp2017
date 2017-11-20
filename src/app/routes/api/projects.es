
import Joi from 'joi';

import constants from 'lib/constants';
import ProjectsController from 'controllers/projects';

const projectsController = new ProjectsController();
const bind = (method) => projectsController[method].bind(projectsController);

export default function generateRoutes(validParams) {
  const validRegions = validParams.regions;
  const validProjects = validParams.projects;
  return [
    {
      method: 'GET',
      path: '/projects',
      config: {
        cache: {
          expiresIn: constants.API_CACHE_EXPIRES_IN
        },
        description: 'Get all water management strategy projects.',
      },
      handler: bind('getAll')
    },
    {
      method: 'GET',
      path: '/projects/{projectId}',
      config: {
        validate: {
          params: {
            projectId: Joi.number().only(validProjects).required()
          }
        },
        cache: {
          expiresIn: constants.API_CACHE_EXPIRES_IN
        },
        description: 'Get the water management strategy project identified by {projectId}.'
      },
      handler: bind('getOne')
    },
    {
      method: 'GET',
      path: '/projects/search',
      config: {
        validate: {
          query: {
            name: Joi.string().min(3).required()
          }
        },
        //no cache for search
        description: 'Find a water management strategy project by name or partial name.',
        notes: 'Use the <code>name={nameOrPartial}</code> query parameter to provide a name or partial name.'
      },
      handler: bind('getByNamePartial')
    },
    {
      method: 'GET',
      path: '/projects/sponsor/{regionLetter}',
      config: {
        validate: {
          params: {
            regionLetter: Joi.string().only(validRegions).insensitive().required()
          }
        },
        cache: {
          expiresIn: constants.API_CACHE_EXPIRES_IN
        },
        description: 'Get all water management strategy projects sponsored by the region identified by {regionLetter}.'
      },
      handler: bind('getSponsorRegion')
    },
    {
      method: 'GET',
      path: '/projects/region/{regionLetter}',
      config: {
        validate: {
          params: {
            regionLetter: Joi.string().only(validRegions).insensitive().required()
          }
        },
        cache: {
          expiresIn: constants.API_CACHE_EXPIRES_IN
        },
        description: 'Get all water management strategy projects in the water user group region identified by {regionLetter}.'
      },
      handler: bind('getWugRegion')
    }
  ];
}