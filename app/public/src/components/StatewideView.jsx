
import R from 'ramda';
import React from 'react';
import Helmet from 'react-helmet';
import Spinner from 'react-spinkit';

import StatewideDataStore from '../stores/StatewideDataStore';

import StatewideViewMap from './maps/StatewideViewMap';
import StatewideSummary from './StatewideSummary';
import ThemeTotalsByDecadeChart from './charts/ThemeTotalsByDecadeChart';
import ThemeTypesByDecadeChart from './charts/ThemeTypesByDecadeChart';
import DataByTypeCharts from './charts/DataByTypeCharts';
// import ThemeMaps from './maps/ThemeMaps';
// import DecadeSelector from './DecadeSelector';

export default React.createClass({

  getInitialState() {
    return StatewideDataStore.getState();
  },

  componentDidMount() {
    StatewideDataStore.listen(this.onChange);

    this.fetchData();
  },

  componentWillReceiveProps() {
    this.fetchData();
  },

  componentWillUnmount() {
    StatewideDataStore.unlisten(this.onChange);
  },

  onChange(state) {
    this.setState(state);
  },

  fetchData() {
    // Fetch statewide data
    StatewideDataStore.fetch();
  },

  render() {
    const data = this.state.data;

    return (
      <div className="statewide-view">
        <Helmet title="Statewide Summary" />
        <section className="main-content">
          <div className="view-top statewide-view-top">
            <div className="summary-wrapper wrapper">
              <StatewideSummary viewData={data} />
            </div>
            <StatewideViewMap />
          </div>

          {
            (() => {
              if (!data || R.isEmpty(R.keys(data))) {
                return (
                  <div className="container">
                    <div className="row panel-row">
                      <div className="twelve columns">
                        <Spinner spinnerName="double-bounce" noFadeIn />
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div>
                  <div className="container">
                    <div className="row panel-row">
                      <div className="twelve columns">
                        <ThemeTotalsByDecadeChart viewData={data} />
                      </div>
                    </div>

                    <div className="row panel-row">
                      <div className="twelve columns">
                        <ThemeTypesByDecadeChart viewData={data} />
                      </div>
                    </div>

                    <div className="row panel-row">
                      <div className="twelve columns">
                        <DataByTypeCharts viewData={data} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()
          }

        </section>
      </div>
    );
  }

});