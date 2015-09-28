// Takes simplified route defintions and returns Hapi 'GET' routes
// Simplified routes are of form
//  {
//    path: String for route path,
//    params: Hash of Joi validators
//    handler: String of method name in controller
//  }
function toHapiRoutes(routeConfigs, controller) {
  return routeConfigs.map((route) => {
    return {
      method: 'GET',
      path: route.path,
      config: {
        validate: {
          params: route.params || {},
          query: route.query || {}
        },
        cache: {
          expiresIn: 60 * 60 * 24 * 1000
        }
      },
      handler: controller[route.handler].bind(controller),
    };
  });
}

export default toHapiRoutes;