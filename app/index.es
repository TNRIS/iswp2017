const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const Etags = require('hapi-etags');
const Good = require('good');
const GoodConsole = require('good-console');
const RequireHttps = require('hapi-require-https');
const swig = require('swig');

const ValidParameters = require('plugins/validParameters');
const homeRoutes = require('routes/home');
const publicRoutes = require('routes/public');
const apiRoutes = require('routes/api');
const downloadRoutes = require('routes/download');
const config = require('config');
const webpackAssets = require('webpack-assets.json');

const server = new Hapi.Server({
  debug: {request: ['*']},
  connections: {
    routes: {
      // enable cors on all routes
      cors: true,
    },
  },
});

server.on('request-error', (request, err) => {
  console.error(err);
});

server.connection({
  port: config.port,
  router: {stripTrailingSlash: true},
});

const loggingOptions = {
  opsInterval: 1000,
  reporters: [{
    reporter: GoodConsole,
    events: {log: '*', error: '*', request: '*'},
  },
]};

const plugins = [
  Inert,
  Vision,
  Etags,
  {register: Good, options: loggingOptions},
  require('plugins/validParameters'),
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
      cssBundleName: webpackAssets.main.css,
    },
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
    },
  });

  if (!module.parent) {
    server.start(() => {
      console.log(`Server running at ${server.info.uri}`);
    });
  }
});

export default server;
