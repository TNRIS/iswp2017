import React from 'react';
import Router from 'react-router';
import routes from './routes';

import L from 'leaflet'; //eslint-disable-line

import './vendor/css/normalize.css';
import './vendor/css/skeleton.css';
import 'react-datagrid/index.css';

import './sass/main.scss';

Router.run(routes, Router.HistoryLocation, (Root) => {
  React.render(<Root/>, document.getElementById('reactApp'));
});
