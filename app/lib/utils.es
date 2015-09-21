
export default {
  // Takes simplified route defintions and returns Hapi 'GET' routes
  // Simplified routes are of form
  //  {
  //    path: String for route path,
  //    params: Hash of Joi validators
  //    handler: String of method name in controller
  //  }
  toHapiRoutes(routes, controller) {
    return routes.map((route) => {
      return {
        method: 'GET',
        path: route.path,
        config: {
          validate: {
            params: route.params
          }
        },
        handler: controller[route.handler].bind(controller)
      };
    });
  }

};