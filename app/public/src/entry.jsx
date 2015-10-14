
import React from 'react';
import Router from 'react-router';
import routes from './routes';

import './vendor/css/normalize.css';
import './vendor/css/skeleton.css';
import 'fixed-data-table/dist/fixed-data-table.css';
import 'chartist/dist/chartist.min.css';

import './sass/main.scss';

Router.run(routes, Router.HistoryLocation, (Root) => {
  React.render(<Root/>, document.getElementById('reactApp'));
});
