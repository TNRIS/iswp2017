
import R from 'ramda';
import React from 'react';
import Helmet from 'react-helmet';
import Spinner from 'react-spinkit';
import classnames from 'classnames';

import StatewideDataStore from '../stores/StatewideDataStore';

import StatewideViewMap from './maps/StatewideViewMap';
import StatewideSummary from './StatewideSummary';
import ThemeTotalsByDecadeChart from './charts/ThemeTotalsByDecadeChart';
import ThemeTypesByDecadeChart from './charts/ThemeTypesByDecadeChart';
import DataByTypeCharts from './charts/DataByTypeCharts';
import ViewChoiceSelectors from './ViewChoiceSelectors';
import RegionalSummaryTable from './RegionalSummaryTable';

// import ThemeMaps from './maps/ThemeMaps';
// import DecadeSelector from './DecadeSelector';

export default React.createClass({

  getInitialState() {
    return {
      isStuck: false,
      data: StatewideDataStore.getState().data
    };
  },

  componentDidMount() {
    StatewideDataStore.listen(this.onChange);

    window.addEventListener('scroll', this.handleScroll);
    this.fetchData();
  },

  componentWillReceiveProps() {
    this.fetchData();
  },

  componentWillUnmount() {
    StatewideDataStore.unlisten(this.onChange);
    window.removeEventListener('scroll', this.handleScroll);
  },

  onChange(state) {
    this.setState(state);
  },

  fetchData() {
    // Fetch statewide data
    StatewideDataStore.fetch();
  },

  handleScroll() {
    const y = document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (!this.refs.viewChoiceSection) {
      return;
    }
    const stickyTop = this.refs.viewChoiceSection.offsetTop;
    if (y >= stickyTop) {
      this.setState({isStuck: true});
    }
    else {
      this.setState({isStuck: false});
    }
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

                  <div className={classnames({"is-stickied": this.state.isStuck}, "view-choice-wrap")} ref="viewChoiceSection">
                    <div className={classnames({"sticky": this.state.isStuck}, "view-choice-container")}
                      ref="stickyEl">
                      <h4>Data by Planning Decade and Theme</h4>
                      <ViewChoiceSelectors />
                    </div>

                    <div className="container">
                      <div className="row panel-row">
                        <div className="twelve columns">
                          <RegionalSummaryTable viewData={data} />
                        </div>
                      </div>

                      {
                        //TODO: TreeMaps of Regional Summary data
                        /*<div className="row panel-row">
                          <div className="twelve columns">

                          </div>
                        </div>*/
                      }
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