
import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';
import PureRenderMixin from 'react-addons-pure-render-mixin';

export default createReactClass({
  displayName: 'ProjectSummarySubhead',

  propTypes: {
    project: PropTypes.object
  },

  mixins: [PureRenderMixin],

  getInitialState() {
    return {};
  },

  render() {
    if (!this.props.project.OnlineDecade && !this.props.project.CapitalCost) {
      return (<p/>);
    }

    const displayCost = this.props.project.CapitalCost.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return (
        <div>
          <p>
            Decade Online: {this.props.project.OnlineDecade}
          </p>
          <p>
            Capital Cost: ${displayCost}
          </p>
        </div>
    );
  },
});
