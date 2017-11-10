import Hapi from 'hapi';
import path from 'path';
import Inert from 'inert';
import Vision from 'vision';
import Etags from 'hapi-etags';
import Good from 'good';
import GoodConsole from 'good-console';
import RequireHttps from 'hapi-require-https';
import swig from 'swig';

import ValidParameters from 'plugins/validParameters';
import homeRoutes from 'routes/home';
import publicRoutes from 'routes/public';
import apiRoutes from 'routes/api';
import downloadRoutes from 'routes/download';
import config from 'config';
import webpackAssets from 'webpack-assets.json';

const server = new Hapi.Server({
  debug: {request: ['*']},
  connections: {
    routes: {
      // enable cors on all routes
      cors: true,
      files: {
        // FIXME: make this a relative path
        relativeTo: path.join(__dirname, 'public'),
      }
    }
  }
});

server.on('request-error', (request, err) => {
  console.error(err);
});

server.connection({
  port: config.port,
  routes: {log: true},
  router: {stripTrailingSlash: true}
});

const loggingOptions = {
  ops: {
    interval: 1000
  },
  reporters: {
    goodConsoleReporter: [{
      module: 'good-console',
      args: [{log: '*', error: '*', request: '*'}]
    }]
  }
}

const plugins = [
  Inert,
  Vision,
  Etags,
  {register: Good, options: loggingOptions},
  ValidParameters
];

if (process.env.NODE_ENV === 'production') {
  plugins.push(RequireHttps);
}

server.register(plugins, (err) => {
  if (err) {
    console.error(err);
    return;
  }

  server.views({
    engines: {
      swig,
    },
    relativeTo: __dirname,
    path: './views',
    context: {
      gaTrackingCode: config.gaTrackingCode,
      jsBundleName: webpackAssets.main.js,
      cssBundleName: webpackAssets.main.css
    }
  });

  publicRoutes.addTo(server, '/public');
  apiRoutes.addTo(server, '/api/v1');
  downloadRoutes.addTo(server, '/download');
  homeRoutes.addTo(server);

  server.route({
    method: '*',
    path: '/{p*}',
    handler: (request, reply) => {
      reply.view('404').code(404);
    }
  });

  if (!module.parent) {
    server.start(() => {
      console.log(`Server running at ${server.info.uri}`);
    });
  }
});

export default server;
