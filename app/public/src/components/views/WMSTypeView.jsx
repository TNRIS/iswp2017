import React from 'react';
import PropTypes from 'prop-types';


export default class WMSTypeView extends React.Component {
    constructor (props) {
        super(props);
    }

    render() {
        console.log(this.props);
        return (
            <div>{this.props.match.params.wmsType}</div>
        )
    }
}

WMSTypeView.propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        wmsType: PropTypes.string.isRequired
      }).isRequired
    })
  }