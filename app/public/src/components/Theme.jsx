
import React from 'react';

import ThemeDataStore from '../stores/ThemeDataStore';
import ThemeDataActions from '../actions/ThemeDataActions';
import ThemeChart from './ThemeChart';
import ThemeMap from './ThemeMap';
import ThemeTable from './ThemeTable';
import ThemePropTypes from '../mixins/ThemePropTypes';

export default React.createClass({
  // TODO: More validation on properties
  mixins: [ThemePropTypes],

  getInitialState() {
    return ThemeDataStore.getState();
  },

  componentDidMount() {
    ThemeDataStore.listen(this.onChange);

    const params = this.props.params;
    ThemeDataActions.fetchThemeData({
      theme: params.theme, year: params.year, type: params.type, typeId: params.typeId
    });
  },

  componentWillUnmount() {
    ThemeDataStore.unlisten(this.onChange);
  },

  onChange(state) {
    this.setState(state);
  },

  render() {
    return (
      <div className={`theme-container theme-${this.props.params.theme}`}>
        <div className="row">
          <div className="six columns">
            <ThemeChart {...this.props} />
          </div>
          <div className="six columns">
            <ThemeMap {...this.props} />
          </div>
        </div>
        <div className="row">
          <div className="twelve columns">
            <ThemeTable {...this.props} />
          </div>
        </div>
      </div>
    );
  }
});