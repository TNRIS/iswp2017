import React from 'react';
import LocationStore from '../stores/LocationStore';
import LocationActions from '../actions/LocationActions';

export default React.createClass({
  getInitialState() {
    return LocationStore.getState();
  },

  componentDidMount() {
    LocationStore.listen(this.onChange);
    LocationActions.fetchLocations();
  },

  componentWillUnmount() {
    LocationStore.unlisten(this.onChange);
  },

  onChange(state) {
    this.setState(state);
  },

  render() {
    if (this.state.errorMessage) {
      return (
        <div>Something is wrong</div>
      );
    }

    if (!this.state.locations.size) {
      return (
        <div>LOADING...</div>
      );
    }

    return (
      <ul>
        {this.state.locations.map((location) => {
          return (
            <li key={location.get('id')}>{location.get('name')}</li>
          );
        })}
      </ul>
    );
  }
});
