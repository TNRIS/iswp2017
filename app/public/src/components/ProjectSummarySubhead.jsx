
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

export default React.createClass({
  propTypes: {
    project: React.PropTypes.object
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
  }
});
