
import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import hat from 'hat';
import classnames from 'classnames';

import constants from '../constants';

export default createReactClass({
  displayName: 'DecadeSelector',

  propTypes: {
    value: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired
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

  clickDecade(decade) {
    this.setState({selectedDecade: decade});
    this.props.onSelect(decade);
  },

  selectDecadeChange(event) {
    const decade = event.target.value;
    this.setState({selectedDecade: decade});
    this.props.onSelect(decade);
  },

  render() {
    const selectId = `select-${hat()}`;
    const selectedDecade = this.state.selectedDecade;

    return (
      <div className="selector decade-selector">
        <div className="show-medium">
          {
            constants.DECADES.map((decade) => {
              return (
                <button key={`button-${decade}`}
                  className={classnames('button', {'active': decade === this.state.selectedDecade})}
                  onClick={this.clickDecade.bind(this, decade)}>
                  {decade}
                </button>
              );
            })
          }
        </div>
        <div className="hide-medium">
          <label htmlFor={selectId}>Decade:</label>
          <select id={selectId} value={selectedDecade} onChange={this.selectDecadeChange}>
            {
              constants.DECADES.map((decade) => {
                return (<option key={`option-${decade}`} value={decade}>{decade}</option>);
              })
            }
          </select>
        </div>
      </div>
    );
  }
});
