function toHapiRoutes(routes, controller) {
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

export default toHapiRoutes;