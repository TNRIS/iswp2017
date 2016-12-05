import R from 'ramda';
import React from 'react';
import Helmet from 'react-helmet';
import Spinner from 'react-spinkit';

import constants from '../../constants';
import DownloadDataLink from '../DownloadDataLink';
import DataViewChoiceStore from '../../stores/DataViewChoiceStore';
import PlacePivotTable from '../PlacePivotTable';
import SourceDataStore from '../../stores/SourceDataStore';
import SourceViewMap from '../maps/SourceViewMap';
import SourceSummary from '../SourceSummary';
import SrcDataViewChoiceWrap from '../SrcDataViewChoiceWrap';
import StrategiesBreakdown from '../StrategiesBreakdown';
import ThemeMaps from '../maps/ThemeMaps';

export default React.createClass({
  propTypes: {
    params: React.PropTypes.shape({
      sourceId: React.PropTypes.integer
    }).isRequired
  },

  getInitialState() {
    return {
      sourceData: SourceDataStore.getState().sourceData,
      viewChoice: DataViewChoiceStore.getState()
    };
  },

  componentDidMount() {
    SourceDataStore.listen(this.onSourceDataChange);
    DataViewChoiceStore.listen(this.onDataViewChoiceChange);

    this.fetchSourceData(this.props.params);
  },

  componentWillReceiveProps(nextProps) {
    // Route params are in this.props, and when route changes the data
    // need to be fetched again
    this.fetchSourceData(nextProps.params);
  },

  componentWillUnmount() {
    SourceDataStore.unlisten(this.onSourceDataChange);
    DataViewChoiceStore.unlisten(this.onDataViewChoiceChange);
  },

  onSourceDataChange(state) {
    this.setState({sourceData: state.sourceData});
  },

  onDataViewChoiceChange(state) {
    this.setState({viewChoice: state});
  },

  fetchSourceData(params) {
    SourceDataStore.fetch({
      sourceId: params.sourceId
    });
  },

  render() {
    const params = this.props.params;
    const sourceData = this.state.sourceData;
    const title = sourceData.boundary ? sourceData.boundary.features[0].properties.name : '';
    const selectedTheme = !(constants.SRC_THEMES.includes(this.state.viewChoice.selectedTheme)) ? "supplies" : this.state.viewChoice.selectedTheme;

    return (
      <div className="source-view">
      <Helmet title={title} />
        <section>
          <div className="view-top source-view-top">
            <div className="summary-wrapper container">
              <SourceSummary sourceData={sourceData} />
            </div>
            <SourceViewMap sourceData={sourceData} />
          </div>

          {
            (() => {
              if (!sourceData || R.isEmpty(R.keys(sourceData))) {
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
                  <SrcDataViewChoiceWrap decade={this.state.viewChoice.selectedDecade}
                    theme={selectedTheme}>
                    <div className="container">
                      
                      <div className="row panel-row">
                        <div className="twelve columns">
                          <span className="view-name">{title}</span>
                          <ThemeMaps placeData={sourceData}
                            decade={this.state.viewChoice.selectedDecade}
                            theme={selectedTheme} />
                        </div>
                      </div>

                      {selectedTheme === 'strategies' &&
                        (
                          <div className="row panel-row">
                            <div className="twelve columns">
                              <span className="view-name">{title}</span>
                              <StrategiesBreakdown viewData={sourceData.data}
                                decade={this.state.viewChoice.selectedDecade} />
                            </div>
                          </div>
                        )
                      }

                      <div className="row panel-row">
                        <div className="twelve columns">
                          <span className="view-name">{title}</span>
                          <PlacePivotTable viewData={sourceData.data}
                          decade={this.state.viewChoice.selectedDecade}
                          theme={selectedTheme} />
                          <h4>Download Data</h4>
                          <ul>
                            {
                              constants.SRC_THEMES.map((theme) => {
                                if (R.isEmpty(sourceData.data[theme].rows)) {
                                  return (
                                    <li key={`download-${theme}`}>
                                      No {constants.THEME_TITLES[theme]} data exist for this water source
                                    </li>
                                  );
                                }
                                return (
                                  <li key={`download-${theme}`}>
                                    <DownloadDataLink
                                      type="source"
                                      typeId={sourceData.boundary.features[0].properties.sourceid}
                                      theme={theme} />
                                  </li>
                                );
                              })
                            }
                          </ul>
                        </div>
                      </div>

                    </div>
                  </SrcDataViewChoiceWrap>
                </div>
              );
            })()
          }
          

        </section>
      </div>
    );
  }

});
