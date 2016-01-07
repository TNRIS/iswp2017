
import R from 'ramda';
import Boom from 'boom';

function isEmptyObj(o) {
  if (!o) { return true; }
  return R.isEmpty(R.keys(o));
}

function handleApiError(reply) {
  return (err) => {
    console.error(err);
    reply(Boom.badImplementation());
  };
}

function addRoutes(server, routes, base = '') {
  if (!Array.isArray(routes)) {
    throw new Error('routes must be an array');
  }

  let basePath = base;
  if (basePath.lastIndexOf('/') === basePath.length - 1) {
    basePath = basePath.slice(0, basePath.length - 1);
  }

  routes.forEach((route) => {
    route.path = basePath + route.path;
    server.route(route);
  });
}

export default {
  isEmptyObj,
  handleApiError,
  addRoutes
};