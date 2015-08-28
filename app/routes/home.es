
const themes = ['demands', 'population', 'needs', 'supplies', 'strategies'];

const routes = themes.map((theme) => {
  return {
    method: 'GET',
    path: `/${theme}/{params*}`,
    handler: (request, reply) => reply.view('index')
  };
});

routes.unshift({
  method: 'GET',
  path: '/',
  handler: (request, reply) => reply.view('index')
});

export default routes;