
import R from 'ramda';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import constants from '../../constants';
import PropTypes from '../../utils/CustomPropTypes';
import DecadeChoiceStore from '../../stores/DecadeChoiceStore';
import ThemeMap from './ThemeMap';

export default React.createClass({
  propTypes: {
    placeData: PropTypes.PlaceData,
  },

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

  render() {
    if (!this.props.placeData || !this.props.placeData.data) {
      return (
        <div />
      );
    }

    const placeData = this.props.placeData;
    const decade = this.state.selectedDecade;

    const themeGroups = R.splitEvery(2, constants.THEMES);

    return (
      <div>
        <h4>Water Usage Type Maps - {decade}</h4>

        {themeGroups.map((themes, i) => {
          return (
            <div className="row" key={i}>
              {themes.map((theme, j) => {
                return (
                  <div className="six columns" key={j}>
                    <ThemeMap theme={theme}
                      data={placeData.data[theme]}
                      boundary={placeData.boundary}
                      decade={decade} />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }
});