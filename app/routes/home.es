
export default [
  {
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
      reply.view('index', {someone: 'james'});
    }
  }
];