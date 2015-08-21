import Hapi from 'hapi';
import Inert from 'inert';
import path from 'path';

const server = new Hapi.Server();
server.register(Inert, () => {

  server.connection({port: 3333});

  server.route({
    method: 'GET',
    path: '/public/{param*}',
    handler: {
      directory: {
        path: path.normalize(__dirname + '/public/dist/')
      }
    }
  });

  server.start(() => {
    console.log(`Server running at ${server.info.uri}`);
  });
});