import React from 'react';
import {PureRenderMixin} from 'react/addons';
import DataGrid from 'react-datagrid';
import Spinner from 'react-spinkit';

const columns = [
  {
    name: 'EntityName',
    title: 'Name',
    flex: 2
  },
  {
    name: 'Value',
    title: 'Value',
    flex: 1
  }
];

export default React.createClass({
  propTypes: {
    dataRows: React.PropTypes.array
  },

  mixins: [PureRenderMixin],

  render() {
    if (this.props.dataRows) {
      return (<DataGrid dataSource={this.props.dataRows}
        columns={columns}
        idProperty={'EntityId'}
        withColumnMenu={false} />
      );
    }
    return (
      <Spinner spinnerName="double-bounce" />
    );
  }
});

