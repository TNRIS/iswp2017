import path from 'path';

const indexPaths = [
  '/',
  '/statewide',
  '/region/{params*}',
  '/county/{params*}',
  '/entity/{params*}',
];

const routes = indexPaths.map((p) => {
  return {
    method: 'GET',
    path: p,
    handler: (request, reply) => reply.view('index')
  };
});

routes.push({
  method: 'GET',
  path: '/robots.txt',
  handler: {
    file: {
      path: path.normalize(__dirname + '../../public/static/robots.txt')
    }
  }
});

export default routes;