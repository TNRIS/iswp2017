
const themes = ['', 'demands', 'population', 'needs', 'supplies', 'strategies'];

const routes = themes.map((theme) => {
  return {
    method: 'GET',
    path: `/${theme}`,
    handler: (request, reply) => {
      reply.view('index');
    }
  };
});

export default routes;