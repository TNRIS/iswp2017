import React from 'react';
import PropTypes from 'prop-types';


export default class WMSView extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log(this.props)
        return (
            <div>WMS View</div>
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