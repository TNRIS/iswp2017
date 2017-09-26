
import R from 'ramda';
import React from 'react';
import Helmet from 'react-helmet';
import Spinner from 'react-spinkit';

import DataByTypeCharts from '../charts/DataByTypeCharts';
import DataViewChoiceStore from '../../stores/DataViewChoiceStore';
import DataViewChoiceWrap from '../DataViewChoiceWrap';
import DownloadDataLink from '../DownloadDataLink';
import {RegionalSummaryTable} from '../RegionalSummaryTable';
import RegionalSummaryTreemap from '../charts/RegionalSummaryTreemap';
import StatewideDataStore from '../../stores/StatewideDataStore';
import StatewideSummary from '../StatewideSummary';
import StatewideViewMap from '../maps/StatewideViewMap';
import StrategiesBreakdown from '../StrategiesBreakdown';
import ThemeTotalsByDecadeChart from '../charts/ThemeTotalsByDecadeChart';
import ThemeTypesByDecadeChart from '../charts/ThemeTypesByDecadeChart';

class StatewideView extends React.Component {

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);

    this.state = {
      data: StatewideDataStore.getState().data,
      viewChoice: DataViewChoiceStore.getState()
    }
  }

  componentDidMount() {
    StatewideDataStore.listen(this.onChange);
    DataViewChoiceStore.listen(this.onDataViewChoiceChange);
    this.fetchData();
  }

  componentWillReceiveProps() {
    this.fetchData();
  }

  componentWillUnmount() {
    StatewideDataStore.unlisten(this.onChange);
    DataViewChoiceStore.unlisten(this.onDataViewChoiceChange);
  }

  onChange(state) {
    this.setState(state);
  }

  onDataViewChoiceChange(state) {
    this.setState({viewChoice: state});
  }

  fetchData() {
    // Fetch statewide data
    StatewideDataStore.fetch();
  }

  render() {
    const data = this.state.data;

    return (
      <div className="statewide-view">
        <Helmet title="Statewide Summary" />
        <section>
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
                        <Spinner name="double-bounce" fadeIn='none' />
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div>
                  <div className="container">
                    <div className="row panel-row">
                      <div className="twelve columns iswp-description">
                        <p>Development of the state water plan is central to the mission of the Texas Water Development Board. Based on 16 regional water plans, the plan addresses the needs of all water user groups in the state – municipal, irrigation, manufacturing, livestock, mining, and steam-electric power – during a repeat of the drought of record that the state suffered in the 1950s. The regional and state water plans consider a 50-year planning horizon: 2020 through 2070.</p>
                        <p>This website lets water users statewide take an up-close look at data in the 2017 State Water Plan and how water needs change over time by showing:</p>
                        <ul>
                          <li>projected water demands,</li>
                          <li>existing water supplies,</li>
                          <li>the relative severity and projected water needs (potential shortages),</li>
                          <li>the water management strategies recommended to address potential shortages, and</li>
                          <li>recommended capital projects and their sponsors.</li>
                        </ul>
                      </div>
                    </div>

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

                      {this.state.viewChoice.selectedTheme === 'strategies' &&
                        (
                          <div className="row panel-row">
                            <div className="twelve columns">
                              <StrategiesBreakdown viewData={data}
                                decade={this.state.viewChoice.selectedDecade} />
                            </div>
                          </div>
                        )
                      }

                      <div className="row panel-row">
                        <div className="twelve columns">
                          <RegionalSummaryTable viewData={data}
                            decade={this.state.viewChoice.selectedDecade}
                            theme={this.state.viewChoice.selectedTheme} />
                          <h5>Download Data</h5>
                          <DownloadDataLink
                            type="statewide"
                            theme={this.state.viewChoice.selectedTheme}
                            viewName="Statewide" />
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
}


export default StatewideView;
