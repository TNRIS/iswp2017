
import React from 'react';
import ReactDOM from 'react-dom';
import Helmet from 'react-helmet';
import titleize from 'titleize';
import Spinner from 'react-spinkit';
import classnames from 'classnames';

import PlaceDataStore from '../stores/PlaceDataStore';
import PlaceViewMap from './maps/PlaceViewMap';
import PlaceSummary from './PlaceSummary';
import ThemeTotalsByDecadeChart from './charts/ThemeTotalsByDecadeChart';
import ThemeTypesByDecadeChart from './charts/ThemeTypesByDecadeChart';
import DataByTypeCharts from './charts/DataByTypeCharts';
import ThemeMaps from './maps/ThemeMaps';
import PlacePivotTable from './PlacePivotTable';
import DecadeSelector from './DecadeSelector';

export default React.createClass({
  propTypes: {
    params: React.PropTypes.shape({
      type: React.PropTypes.string.isRequired,
      typeId: React.PropTypes.string
    }).isRequired
  },

  getInitialState() {
    return {
      isStuck: false,
      placeData: PlaceDataStore.getState().placeData
    };
  },

  componentDidMount() {
    PlaceDataStore.listen(this.onPlaceDataChange);

    window.addEventListener('scroll', this.handleScroll);
    this.fetchPlaceData(this.props.params);
  },

  componentWillReceiveProps(nextProps) {
    // Route params are in this.props, and when route changes the data
    // need to be fetched again
    this.fetchPlaceData(nextProps.params);
  },

  componentWillUnmount() {
    PlaceDataStore.unlisten(this.onPlaceDataChange);
    window.removeEventListener('scroll', this.handleScroll);
  },

  onPlaceDataChange(state) {
    this.setState({placeData: state.placeData});
  },

  fetchPlaceData(params) {
    PlaceDataStore.fetch({
      type: params.type, typeId: params.typeId
    });
  },

  handleScroll() {
    const y = document.documentElement.scrollTop || document.body.scrollTop || 0;
    const stickyTop = this.refs.decadeDependentSection.offsetTop;
    console.log(y, stickyTop);
    if (y >= stickyTop) {
      this.setState({isStuck: true});
    }
    else {
      this.setState({isStuck: false});
    }
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
                viewData={placeData.data} />
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
                        <ThemeTotalsByDecadeChart viewData={placeData.data} />
                      </div>
                    </div>

                    <div className="row panel-row">
                      <div className="twelve columns">
                        <ThemeTypesByDecadeChart viewData={placeData.data} />
                      </div>
                    </div>

                    <div className="row panel-row">
                      <div className="twelve columns">
                        <DataByTypeCharts viewData={placeData.data} />
                      </div>
                    </div>
                  </div>

                  <div className={classnames({"is-stickied": this.state.isStuck}, "decade-dependent-wrap")} ref="decadeDependentSection">

                    <div className={classnames({"sticky": this.state.isStuck}, "decade-selection-container")}
                      ref="stickyEl">
                      <h4>Data by Planning Decade</h4>
                      <DecadeSelector />
                    </div>

                    <div className="container">
                      <div className="row panel-row">
                        <div className="twelve columns">
                          <ThemeMaps placeData={placeData} />
                        </div>
                      </div>

                      <div className="row panel-row">
                        <div className="twelve columns">
                          <PlacePivotTable viewData={placeData.data} />
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