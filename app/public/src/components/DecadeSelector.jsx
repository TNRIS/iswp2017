
import React from 'react';
import {PureRenderMixin} from 'react/addons';

import constants from '../constants';

export default React.createClass({
  mixins: [PureRenderMixin],

  render() {
    return (
      <div className="decade-selector">
        JAMES Select Decade: <strong>2020</strong> | 2040 | 2050 | 2060 | 2070
      </div>
    );
  }
});