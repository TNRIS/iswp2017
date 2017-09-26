
import R from 'ramda';
import Boom from 'boom';

/**
 * Checks for empty object
 * @param {object} o
 * @return {boolean}
 */
export function isEmptyObj(o) {
  if (!o) {
    return true;
  }
  return R.isEmpty(R.keys(o));
}

/**
 * Handles API errors
 * @param {object} reply 
 * @return {err}
 */
export function handleApiError(reply) {
  return (err) => {
    console.error(err);
    reply(Boom.badImplementation());
  };
}

/**
 * Adds route to server
 * @param {object} server 
 * @param {array} routes 
 * @param {string} base 
 */
export function addRoutes(server, routes, base = '') {
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
