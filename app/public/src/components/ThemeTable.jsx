import React from 'react';
import {PureRenderMixin} from 'react/addons';
import {Table, Column} from 'fixed-data-table';
import Spinner from 'react-spinkit';

export default React.createClass({
  propTypes: {
    theme: React.PropTypes.string,
    year: React.PropTypes.string,
    dataRows: React.PropTypes.array
  },

  mixins: [PureRenderMixin],


  render() {
    const valueKey = `Value_${this.props.year}`;
    // TODO: See https://github.com/facebook/fixed-data-table/blob/master/site/examples/SortExample.js
    if (this.props.dataRows) {
      return (
        <Table rowHeight={50}
          width={980}
          height={400}
          rowGetter={(rowIndex) => this.props.dataRows[rowIndex]}
          rowsCount={this.props.dataRows.length}
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
          <Column label="Value (acre-feet/year)"
            flexGrow={1}
            width={200}
            dataKey={valueKey} />
        </Table>
      );
    }
    return (
      <Spinner spinnerName="double-bounce" />
    );
  }
});

