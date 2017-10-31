import React from 'react';
import PropTypes from 'prop-types';


export default class WMSView extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>{this.props.match.params.wmsId}</div>
        )
    }
}

WMSView.propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        wmsId: PropTypes.string.isRequired
      }).isRequired
    })
  }