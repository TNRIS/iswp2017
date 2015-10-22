
import R from 'ramda';
import React from 'react/addons';

import constants from '../constants';
import PropTypes from '../utils/CustomPropTypes';
import ThemeMaps from './maps/ThemeMaps';
import DataTable from './DataTable';
import DecadeSelector from './DecadeSelector';

export default React.createClass({
  propTypes: {
    placeData: PropTypes.PlaceData
  },

  getInitialState() {
    return {
      selectedDecade: R.nth(0, constants.DECADES)
    };
  },

  changeSelectedDecade(decade) {
    this.setState({selectedDecade: decade});
  },

  render() {
    const placeData = this.props.placeData;

    if (!placeData) {
      return (<div/>);
    }

    return (
      <div className="container">
        <div className="row panel-row">
          <DecadeSelector value={this.state.selectedDecade} onChange={this.changeSelectedDecade} />
        </div>

        <div className="row panel-row">
          <div className="twelve columns">
            <ThemeMaps placeData={placeData} decade={this.state.selectedDecade} />
          </div>
        </div>

        <div className="row panel-row">
          <div className="twelve columns">
            <DataTable placeData={placeData} decade={this.state.selectedDecade} />
          </div>
        </div>
      </div>
    );
  }
});