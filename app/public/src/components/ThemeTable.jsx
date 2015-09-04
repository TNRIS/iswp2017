import React from 'react';
import {PureRenderMixin} from 'react/addons';
import {Table, Column} from 'fixed-data-table';
import Spinner from 'react-spinkit';

export default React.createClass({
  propTypes: {
    dataRows: React.PropTypes.array
  },

  mixins: [PureRenderMixin],

  render() {
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
            flexGrow={1}
            width={200}
            dataKey="EntityName" />
          <Column label="Value (acre-feet/year)"
            flexGrow={1}
            width={200}
            dataKey="Value" />
        </Table>
      );
    }
    return (
      <Spinner spinnerName="double-bounce" />
    );
  }
});

