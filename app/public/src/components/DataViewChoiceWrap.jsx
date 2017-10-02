
import PropTypes from 'prop-types';
import R from 'ramda';
import React from 'react';
import classnames from 'classnames';
import debounce from 'debounce';

import constants from '../constants';
import DataViewChoiceSelectors from './DataViewChoiceSelectors';

const themesAndPopulation = R.append('population', constants.THEMES);

export default class DataViewChoiceWrap extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]).isRequired,
    decade: PropTypes.oneOf(constants.DECADES).isRequired,
    theme: PropTypes.oneOf(themesAndPopulation).isRequired,
    hidePopulation: PropTypes.bool
  };

  state = {
    isStuck: false
  };

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);

    //use debounced version for window resize
    this.debouncedHandleScroll = debounce(this.handleScroll, 200);
    window.addEventListener('resize', this.debouncedHandleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.debouncedHandleScroll);
  }

  handleScroll = () => {
    if (!this.shouldCheckStick()) {
      this.setState({isStuck: false});
      return;
    }

    const y = document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (!this.refs.viewChoiceSection) {
      return;
    }

    const stickyTop = this.refs.viewChoiceSection.offsetTop;
    if (y >= stickyTop) {
      this.setState({isStuck: true});
    }
    else {
      this.setState({isStuck: false});
    }
  };

  shouldCheckStick = () => {
    return window.matchMedia("(min-width: 550px)").matches;
  };

  render() {
    const wrapStyle = {};
    if (this.shouldCheckStick() && this.state.isStuck) {
      wrapStyle.paddingTop = this.refs.stickyEl.offsetHeight * 1.20;
    }

    return (
      <div className="view-choice-wrap" ref="viewChoiceSection" style={wrapStyle}>
        <div className={classnames({"sticky": this.state.isStuck}, "view-choice-container")}
          ref="stickyEl">
          <h4>Data by Planning Decade and Theme</h4>
          <DataViewChoiceSelectors
            decade={this.props.decade}
            theme={this.props.theme}
            hidePopulation={this.props.hidePopulation} />
        </div>

        {this.props.children}
      </div>
    );
  }
}
