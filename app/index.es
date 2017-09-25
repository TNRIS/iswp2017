const Hapi = require('hapi');
const Inert = require('Inert');
const Vision = require('Vision');
const Etags = require('hapi-tags');
const Good = require('Good');
const GoodConsole = require('GoodConsole');
const RequireHttps = require('hapi-require-https');
const swig = require('swig');

import ValidParameters from 'plugins/validParameters';
import homeRoutes from 'routes/home';
import publicRoutes from 'routes/public';
import apiRoutes from 'routes/api';
import downloadRoutes from 'routes/download';
import config from 'config';
import webpackAssets from 'webpack-assets.json';

const server = new Hapi.Server({
  debug: { request: ['*'] },
  connections: {
    routes: {
      //enable cors on all routes
      cors: true
    }
  }
});

server.on('request-error', (request, err) => {
  console.error(err);
});

server.connection({
  port: config.port,
  router: { stripTrailingSlash: true }
});

const loggingOptions = {
  opsInterval: 1000,
  reporters: [{
    reporter: GoodConsole,
    events: { log: '*', error: '*', request: '*' }
  }]
};

const plugins = [
  Inert,
  Vision,
  Etags,
  { register: Good, options: loggingOptions },
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
      swig
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