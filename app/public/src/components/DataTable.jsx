import React from 'react';
import {PureRenderMixin} from 'react/addons';
import {Table, Column} from 'fixed-data-table';
import Spinner from 'react-spinkit';

export default React.createClass({
  propTypes: {
    placeData: React.PropTypes.object
  },

  mixins: [PureRenderMixin],

  render() {
    // TODO: See https://github.com/facebook/fixed-data-table/blob/master/site/examples/SortExample.js
    if (this.props.placeData && this.props.placeData.data) {
      return (
        <div>
          <div><p><strong>2020</strong> | 2030 | 2040 | 2050 | 2060 | 2070</p></div>
          <Table rowHeight={50}
            width={980}
            height={400}
            rowGetter={(rowIndex) => this.props.placeData.data.demands.rows[rowIndex]}
            rowsCount={this.props.placeData.data.demands.rows.length}
            headerHeight={50}>
            <Column label="Name"
              flexGrow={2}
              width={200}
              dataKey="EntityName" />
            <Column label="Region"
              flexGrow={0.5}
              width={100}
              dataKey="WugRegion" />
            <Column label="County"
              flexGrow={1}
              width={200}
              dataKey="WugCounty" />
            <Column label="Demands 2020 (acre-feet/year)"
              flexGrow={1}
              width={200}
              dataKey={'Value_2020'} />
          </Table>
        </div>
      );
    }
    return (
      <Spinner spinnerName="double-bounce" />
    );
  }
});

