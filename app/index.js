import Hapi from 'hapi';
import Inert from 'inert'; //for static directory serving
import Vision from 'vision'; //for view rendering
import swig from 'swig';
import path from 'path';

const server = new Hapi.Server();
server.register([Inert, Vision], () => {

  server.connection({port: 3333});

  server.views({
    engines: {
      swig: swig
    },
    relativeTo: __dirname,
    path: './views',
    layoutPath: './views/layout'
    //helpersPath: './views/helpers'
  });

  server.route({
    method: 'GET',
    path: '/public/{param*}',
    handler: {
      directory: {
        path: path.normalize(__dirname + '/public/dist/')
      }
    }
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: (request, reply) => {
      reply.view('index', {someone: 'james'});
    }
  });

  server.start(() => {
    console.log(`Server running at ${server.info.uri}`);
  });
});