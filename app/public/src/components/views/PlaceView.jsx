
import React from 'react';
import Helmet from 'react-helmet';
import titleize from 'titleize';
import Spinner from 'react-spinkit';

import utils from '../../utils';
import DataByTypeCharts from '../charts/DataByTypeCharts';
import DataViewChoiceStore from '../../stores/DataViewChoiceStore';
import DataViewChoiceWrap from '../DataViewChoiceWrap';
import PlaceDataStore from '../../stores/PlaceDataStore';
import PlacePivotTable from '../PlacePivotTable';
import PlaceSummary from '../PlaceSummary';
import PlaceViewMap from '../maps/PlaceViewMap';
import RegionDescription from '../RegionDescription';
import StrategiesBreakdown from '../StrategiesBreakdown';
import ThemeMaps from '../maps/ThemeMaps';
import ThemeTotalsByDecadeChart from '../charts/ThemeTotalsByDecadeChart';
import ThemeTypesByDecadeChart from '../charts/ThemeTypesByDecadeChart';

export default React.createClass({
  propTypes: {
    params: React.PropTypes.shape({
      type: React.PropTypes.string.isRequired,
      typeId: React.PropTypes.string
    }).isRequired
  },

  getInitialState() {
    return {
      placeData: PlaceDataStore.getState().placeData,
      viewChoice: DataViewChoiceStore.getState()
    };
  },

  componentDidMount() {
    PlaceDataStore.listen(this.onPlaceDataChange);
    DataViewChoiceStore.listen(this.onDataViewChoiceChange);

    this.fetchPlaceData(this.props.params);
  },

  componentWillReceiveProps(nextProps) {
    // Route params are in this.props, and when route changes the data
    // need to be fetched again
    this.fetchPlaceData(nextProps.params);
  },

  componentWillUnmount() {
    PlaceDataStore.unlisten(this.onPlaceDataChange);
    DataViewChoiceStore.unlisten(this.onDataViewChoiceChange);
  },

  onPlaceDataChange(state) {
    this.setState({placeData: state.placeData});
  },

  onDataViewChoiceChange(state) {
    this.setState({viewChoice: state});
  },

  fetchPlaceData(params) {
    PlaceDataStore.fetch({
      type: params.type, typeId: params.typeId
    });
  },

  render() {
    const params = this.props.params;
    const placeData = this.state.placeData;

    let title;
    switch (params.type.toLowerCase()) {
    case 'region':
      title = `Region ${params.typeId.toUpperCase()}`;
      break;
    case 'county':
      title = `${params.typeId} County`;
      break;
    default:
      title = '';
    }

    const viewName = utils.getViewName(params.type, params.typeId);

    return (
      <div className="place-view">
        <Helmet title={title} />
        <section>
          <div className="view-top place-view-top">
            <div className="summary-wrapper container">
              <PlaceSummary
                type={params.type}
                typeId={params.typeId}
                viewData={placeData.data} />
            </div>
            <PlaceViewMap
              type={params.type}
              placeData={placeData} />
          </div>

          {
            (() => {
              if (!placeData.data) {
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
                    {
                      params.type.toLowerCase() === 'region' &&
                      <div className="row panel-row">
                        <div className="twelve columns">
                          <RegionDescription region={params.typeId.toUpperCase()} />
                        </div>
                      </div>
                    }

                    <div className="row panel-row">
                      <div className="twelve columns">
                        <span className="view-name">{viewName}</span>
                        <ThemeTotalsByDecadeChart viewData={placeData.data} />
                      </div>
                    </div>

                    <div className="row panel-row">
                      <div className="twelve columns">
                        <span className="view-name">{viewName}</span>
                        <ThemeTypesByDecadeChart viewData={placeData.data} />
                      </div>
                    </div>

                    <div className="row panel-row">
                      <div className="twelve columns">
                        <span className="view-name">{viewName}</span>
                        <DataByTypeCharts viewData={placeData.data} />
                      </div>
                    </div>
                  </div>

                  <DataViewChoiceWrap decade={this.state.viewChoice.selectedDecade}
                    theme={this.state.viewChoice.selectedTheme}>

                    <div className="container">
                      <div className="row panel-row">
                        <div className="twelve columns">
                          <span className="view-name">{viewName}</span>
                          <ThemeMaps placeData={placeData}
                            decade={this.state.viewChoice.selectedDecade}
                            theme={this.state.viewChoice.selectedTheme} />
                        </div>
                      </div>

                      {this.state.viewChoice.selectedTheme === 'strategies' &&
                        (
                          <div className="row panel-row">
                            <div className="twelve columns">
                              <span className="view-name">{viewName}</span>
                              <StrategiesBreakdown viewData={placeData.data}
                                decade={this.state.viewChoice.selectedDecade} />
                            </div>
                          </div>
                        )
                      }

                      <div className="row panel-row">
                        <div className="twelve columns">
                          <span className="view-name">{viewName}</span>
                          <PlacePivotTable viewData={placeData.data}
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