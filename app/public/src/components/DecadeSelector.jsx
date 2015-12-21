
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import constants from '../constants';

export default React.createClass({
  propTypes: {
    value: React.PropTypes.string.isRequired,
    onSelect: React.PropTypes.func.isRequired
  },

  mixins: [PureRenderMixin],

  getInitialState() {
    return {
      selectedDecade: this.props.value
    };
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.setState({selectedDecade: nextProps.value});
    }
  },

  selectDecade(decade) {
    this.setState({selectedDecade: decade});
    this.props.onSelect(decade);
  },

  render() {
    return (
      <div className="u-cf selector decade-selector">
      {
        constants.DECADES.map((decade, i) => {
          const isActive = this.state.selectedDecade === decade;
          if (isActive) {
            return (<button  key={i} className="active button-primary">{decade}</button>);
          }
          return (
            <button key={i} className="button" onClick={this.selectDecade.bind(this, decade)}>
              {decade}
            </button>
          );
        })
      }
      </div>
    );
  }
});