import React from 'react';
import {PureRenderMixin} from 'react/addons';
import DataGrid from 'react-datagrid';

import ThemeDataStore from '../stores/ThemeDataStore';
import ThemePropTypes from '../mixins/ThemePropTypes';

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
  mixins: [ThemePropTypes, PureRenderMixin],

  getInitialState() {
    return ThemeDataStore.getState();
  },

  componentDidMount() {
    ThemeDataStore.listen(this.onChange);
  },

  componentWillUnmount() {
    ThemeDataStore.unlisten(this.onChange);
  },

  onChange(state) {
    this.setState(state);
  },

  render() {
    return (
      <DataGrid dataSource={this.state.themeData}
          columns={columns}
          idProperty={'EntityId'}
          withColumnMenu={false} />
    );
  }
});

