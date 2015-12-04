

import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import constants from '../constants';
import DecadeChoiceActions from '../actions/DecadeChoiceActions';
import DecadeChoiceStore from '../stores/DecadeChoiceStore';

export default React.createClass({
  mixins: [PureRenderMixin],

  getInitialState() {
    return DecadeChoiceStore.getState();
  },

  componentDidMount() {
    DecadeChoiceStore.listen(this.onDecadeChange);
  },

  componentWillUnmount() {
    DecadeChoiceStore.unlisten(this.onDecadeChange);
  },

  onDecadeChange(state) {
    this.setState(state);
  },

  selectDecade(decade) {
    DecadeChoiceActions.updateDecadeChoice(decade);
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