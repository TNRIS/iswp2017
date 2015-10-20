
import R from 'ramda';
import React from 'react';
import {PureRenderMixin} from 'react/addons';
import {Table} from 'reactable';
import Spinner from 'react-spinkit';

import constants from '../constants';
import PropTypes from '../utils/CustomPropTypes';

export default React.createClass({
  propTypes: {
    placeData: PropTypes.PlaceData,
    decade: React.PropTypes.string
  },

  mixins: [PureRenderMixin],

  getDefaultProps() {
    return {
      decade: '2020'
    };
  },

  render() {
    //TODO: Sorting - see https://github.com/facebook/fixed-data-table/blob/master/site/examples/SortExample.js
    //TODO: Switcher to change the year of data
    //TODO: Show all themes in the table?
    const placeData = this.props.placeData;
    if (!placeData || !placeData.data) {
      return (
        <Spinner spinnerName="double-bounce" />
      );
    }

    const tableData = placeData.data.demands.rows;

    return (
      <div>
        <h4>Raw Data</h4>
        <div><p>Select Decade: <strong>2020</strong> | 2030 | 2040 | 2050 | 2060 | 2070</p></div>
        <div className="table-container">
          <Table className="data-table u-full-width"
            data={tableData}
            sortable={true}
          />
        </div>
      </div>
    );
  }
});

