import R from 'ramda';
import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import Spinner from 'react-spinkit';
import titleize from 'titleize';

import constants from '../../constants';
import DownloadDataLink from '../DownloadDataLink';
import DataViewChoiceStore from '../../stores/DataViewChoiceStore';
import PlacePivotTable from '../PlacePivotTable';
import SourceDataStore from '../../stores/SourceDataStore';
import SourceViewMap from '../maps/SourceViewMap';
import SourceSummary from '../SourceSummary';
import SrcDataViewChoiceWrap from '../SrcDataViewChoiceWrap';
import ThemeMaps from '../maps/ThemeMaps';
import ProjectTable from '../ProjectTable';

export default class SourceView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sourceData: SourceDataStore.getState().sourceData,
      viewChoice: DataViewChoiceStore.getState()
    }
  }

  componentDidMount = () => {
    SourceDataStore.listen(this.onSourceDataChange);
    DataViewChoiceStore.listen(this.onDataViewChoiceChange);

    this.fetchSourceData(this.props.match.params);
  }

  componentWillReceiveProps = (nextProps) => {
    // Route params are in this.props, and when route changes the data
    // need to be fetched again
    this.fetchSourceData(nextProps.match.params);
  }

  componentWillUnmount = () => {
    SourceDataStore.unlisten(this.onSourceDataChange);
    DataViewChoiceStore.unlisten(this.onDataViewChoiceChange);
  }

  onSourceDataChange = (state) => {
    this.setState({sourceData: state.sourceData});
  }

  onDataViewChoiceChange = (state) => {
    this.setState({viewChoice: state});
  }

  fetchSourceData = (params) => {
    SourceDataStore.fetch({
      sourceId: params.sourceId
    });
  }

  render() {
    const sourceData = this.state.sourceData;
    console.log(sourceData);
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
                      <div className="twelve columns">
                        <span className="view-name">{title}</span>
                        <ProjectTable type="source" projectData={sourceData.data.projects} />
                      </div>
                    </div>
                  </div>

                  <SrcDataViewChoiceWrap decade={this.state.viewChoice.selectedDecade} theme={selectedTheme}>
                    <div className="container">
                      <div className="row panel-row">
                        <div className="twelve columns">
                          <span className="view-name">{title}</span>
                          <ThemeMaps placeData={sourceData}
                            decade={this.state.viewChoice.selectedDecade}
                            theme={selectedTheme} />
                        </div>
                      </div>

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
                                      No {constants.THEME_TITLES[theme]} data exists for this water source
                                    </li>
                                  );
                                }
                                return (
                                  <li key={`download-${theme}`}>
                                    <DownloadDataLink
                                      type="source"
                                      typeId={sourceData.boundary.features[0].properties.sourceid}
                                      theme={theme}
                                      viewName={titleize(title) + ' Source'} />
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
}

SourceView.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      sourceId: PropTypes.integer
    }).isRequired
  })
};
