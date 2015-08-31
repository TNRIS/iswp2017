import React from 'react';
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
  mixins: [ThemePropTypes],

  // TODO: I think these 4 methods could be better expressed in a mixin,
  // or through using the React ES6 class syntax: https://facebook.github.io/react/docs/reusable-components.html
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
      <div>
        <DataGrid dataSource={this.state.themeData.toJS()}
            columns={columns}
            idProperty={'EntityId'}
            withColumnMenu={false} />
      </div>
    );
  }
});

