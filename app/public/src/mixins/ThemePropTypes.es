import React from 'react';

export default {
  propTypes: {
    params: React.PropTypes.shape({
      theme: React.PropTypes.string.isRequired,
      year: React.PropTypes.string.isRequired,
      type: React.PropTypes.string.isRequired,
      typeId: React.PropTypes.string
    }).isRequired
  }
};