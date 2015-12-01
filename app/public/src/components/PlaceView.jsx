
import React from 'react';
import Helmet from 'react-helmet';
import titleize from 'titleize';
import Spinner from 'react-spinkit';

import PlaceDataStore from '../stores/PlaceDataStore';
import PlaceViewMap from './maps/PlaceViewMap';
import PlaceSummary from './PlaceSummary';
import ThemeTotalsByDecadeChart from './charts/ThemeTotalsByDecadeChart';
import ThemeTypesByDecadeChart from './charts/ThemeTypesByDecadeChart';
import DataByTypeCharts from './charts/DataByTypeCharts';
import ThemeMaps from './maps/ThemeMaps';
import DataTable from './DataTable';
import DecadeSelector from './DecadeSelector';

export default React.createClass({
  propTypes: {
    params: React.PropTypes.shape({
      type: React.PropTypes.string.isRequired,
      typeId: React.PropTypes.string
    }).isRequired
  },

  getInitialState() {
    return PlaceDataStore.getState();
  },

  componentDidMount() {
    PlaceDataStore.listen(this.onChange);

    this.fetchPlaceData(this.props.params);
  },

  componentWillReceiveProps(nextProps) {
    // Route params are in this.props, and when route changes the data
    // need to be fetched again
    this.fetchPlaceData(nextProps.params);
  },

  componentWillUnmount() {
    PlaceDataStore.unlisten(this.onChange);
  },

  onChange(state) {
    this.setState(state);
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
      title = `${titleize(params.typeId)} County`;
      break;
    default:
      title = '';
    }

    return (
      <div className="place-view">
        <Helmet title={title} />
        <section className="main-content">
          <div className="view-top place-view-top">
            <PlaceViewMap
              type={params.type}
              placeData={placeData} />
            <div className="summary-wrapper wrapper">
              <PlaceSummary
                type={params.type}
                typeId={params.typeId}
                placeData={placeData} />
            </div>
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
                    <div className="row panel-row">
                      <div className="twelve columns">
                        <ThemeTotalsByDecadeChart placeData={placeData} />
                      </div>
                    </div>

                    <div className="row panel-row">
                      <div className="twelve columns">
                        <ThemeTypesByDecadeChart placeData={placeData} />
                      </div>
                    </div>

                    <div className="row panel-row">
                      <div className="twelve columns">
                        <DataByTypeCharts placeData={placeData} />
                      </div>
                    </div>
                  </div>

                  <div className="decade-dependent-wrap">
                    <div className="container">
                      <div className="row panel-row">
                        <h4>Data by Planning Decade</h4>
                        <DecadeSelector />
                      </div>

                      <div className="row panel-row">
                        <div className="twelve columns">
                          <ThemeMaps placeData={placeData} />
                        </div>
                      </div>

                      <div className="row panel-row">
                        <div className="twelve columns">
                          <DataTable placeData={placeData} />
                        </div>
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