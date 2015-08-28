import React from 'react';
import ThemeDataStore from '../stores/ThemeDataStore';
import ThemeDataActions from '../actions/ThemeDataActions';

import constants from '../constants';

export default React.createClass({
  getInitialState() {
    return ThemeDataStore.getState();
  },

  componentDidMount() {
    console.log("Route params: ", this.props.params);

    ThemeDataStore.listen(this.onChange);
    ThemeDataActions.fetchThemeData({
      theme: 'demands', year: '2010', type: 'region', typeId: 'L'
    });
  },

  componentWillUnmount() {
    ThemeDataStore.unliste(this.onChange);
  },

  onChange(state) {
    this.setState(state);
  },

  render() {
    return (
      <div>
        <div className="error">{this.state.errorMessage}</div>
        <ul>
          {this.state.themeData.map((row) => {
            return (
              <li key={row.get('EntityId')}>{row.get('EntityName')}</li>
            );
          })}
        </ul>
      </div>
    );
  }

});