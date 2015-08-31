
import React from 'react';

import ThemePropTypes from '../mixins/ThemePropTypes';

export default React.createClass({
  mixins: [ThemePropTypes],

  render() {
    return (
      <div>
        THEME CHART
      </div>
    );
  }
});