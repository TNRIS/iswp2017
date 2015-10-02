
const indexPaths = [
  '/',
  '/region/{params*}',
  '/county/{params*}',
  '/entity/{params*}',
];

const routes = indexPaths.map((path) => {
  return {
    method: 'GET',
    path: path,
    handler: (request, reply) => reply.view('index')
  };
});

export default routes;