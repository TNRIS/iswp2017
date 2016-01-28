
import R from 'ramda';
import React from 'react';
import Helmet from 'react-helmet';
import Spinner from 'react-spinkit';

import StatewideDataStore from '../../stores/StatewideDataStore';
import StatewideViewMap from '../maps/StatewideViewMap';
import StatewideSummary from '../StatewideSummary';
import ThemeTotalsByDecadeChart from '../charts/ThemeTotalsByDecadeChart';
import ThemeTypesByDecadeChart from '../charts/ThemeTypesByDecadeChart';
import DataByTypeCharts from '../charts/DataByTypeCharts';
import RegionalSummaryTreemap from '../charts/RegionalSummaryTreemap';
import DataViewChoiceStore from '../../stores/DataViewChoiceStore';
import DataViewChoiceWrap from '../DataViewChoiceWrap';
import RegionalSummaryTable from '../RegionalSummaryTable';

export default React.createClass({
  getInitialState() {
    return {
      data: StatewideDataStore.getState().data,
      viewChoice: DataViewChoiceStore.getState()
    };
  },

  componentDidMount() {
    StatewideDataStore.listen(this.onChange);
    DataViewChoiceStore.listen(this.onDataViewChoiceChange);
    this.fetchData();
  },

  componentWillReceiveProps() {
    this.fetchData();
  },

  componentWillUnmount() {
    StatewideDataStore.unlisten(this.onChange);
    DataViewChoiceStore.unlisten(this.onDataViewChoiceChange);
  },

  onChange(state) {
    this.setState(state);
  },

  onDataViewChoiceChange(state) {
    this.setState({viewChoice: state});
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
            <div className="summary-wrapper container">
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

                  <DataViewChoiceWrap decade={this.state.viewChoice.selectedDecade}
                    theme={this.state.viewChoice.selectedTheme}>

                    <div className="container">
                      <div className="row panel-row">
                        <div className="twelve columns">
                          <RegionalSummaryTreemap viewData={data}
                            decade={this.state.viewChoice.selectedDecade}
                            theme={this.state.viewChoice.selectedTheme} />
                        </div>
                      </div>

                      <div className="row panel-row">
                        <div className="twelve columns">
                          <RegionalSummaryTable viewData={data}
                            decade={this.state.viewChoice.selectedDecade}
                            theme={this.state.viewChoice.selectedTheme} />
                        </div>
                      </div>
                    </div>
                  </DataViewChoiceWrap>
                </div>
              );
            })()
          }

        </section>
      </div>
    );
  }

});