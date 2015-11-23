
import R from 'ramda';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Spinner from 'react-spinkit';

// import PlaceSummarySubhead from './PlaceSummarySubhead';
import constants from '../constants';
import PropTypes from '../utils/CustomPropTypes';
import LineChart from './charts/LineChart';
import ChartDataTable from './ChartDataTable';

export default React.createClass({
  propTypes: {
    type: React.PropTypes.string,
    typeId: React.PropTypes.string,
    placeData: PropTypes.PlaceData
  },

  mixins: [PureRenderMixin],

  render() {
    const props = this.props;
    let typeAndId = `${props.type}`;

    if (props.type === 'region') {
      typeAndId += ` ${props.typeId}`;
    }
    else if (props.type === 'county') {
      typeAndId = `${props.typeId} County`;
    }

    if (!props.placeData || R.isEmpty(R.keys(props.placeData))) {
      return (
        <div className="view-summary">
          <h2>{typeAndId.toUpperCase()}</h2>
          <Spinner spinnerName="double-bounce" noFadeIn />
        </div>
      );
    }

    const placeData = props.placeData;

    const popChartData = {
      labels: constants.DECADES,
      series: [{
        className: 'series-population',
        data: constants.DECADES.map((year) => {
          return R.path(['data', 'population', 'decadeTotals', year], placeData) || 0;
        }),
        meta: 'population',
        name: 'Population'
      }]
    };

    const popChartOptions = {
      height: '100px'
    };

    //TODO include PlaceSummarySubhead
    return (
      <div className="view-summary">
        <h2>{typeAndId.toUpperCase()}</h2>
        <div className="subhead">

        </div>

        <div>
          <div className="chart-header">
            <h4>Population</h4>
          </div>
          <LineChart chartData={popChartData} chartOptions={popChartOptions} />
          <ChartDataTable className="u-full-width" chartData={popChartData} />
        </div>

      </div>
    );
  }
});