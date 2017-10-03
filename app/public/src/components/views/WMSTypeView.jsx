import React from 'react';
import PropTypes from 'prop-types';


export default class WMSTypeView extends React.Component {
    constructor (props) {
        super(props);
    }

    render() {
        console.log(this.props)
        return (
            <div>{this.props.match.params.wmsTypeId}</div>
        )
    }
}

WMSTypeView.propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        wmsTypeId: PropTypes.string.isRequired
      }).isRequired
    })
  }