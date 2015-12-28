
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import constants from '../../constants';
import ViewChoiceStore from '../../stores/ViewChoiceStore';
import PropTypes from '../../utils/CustomPropTypes';
import ThemeMap from './ThemeMap';

export default React.createClass({
  propTypes: {
    placeData: PropTypes.PlaceData,
  },

  mixins: [PureRenderMixin],

  getInitialState() {
    return ViewChoiceStore.getState();
  },

  componentDidMount() {
    ViewChoiceStore.listen(this.onChoiceChange);
  },

  componentWillUnmount() {
    ViewChoiceStore.unlisten(this.onChoiceChange);
  },

  onChoiceChange(state) {
    this.setState(state);
  },

  render() {
    if (!this.props.placeData || !this.props.placeData.data) {
      return (<div />);
    }

    const placeData = this.props.placeData;
    const selectedDecade = this.state.selectedDecade;
    const selectedTheme = this.state.selectedTheme;
    const themeTitle = constants.THEME_TITLES[selectedTheme];

    const units = selectedTheme === 'population' ? "people" : "acre-feet/year";

    return (
      <div>
        <h4>
          Water User Groups - {selectedDecade} - {themeTitle}
          <span className="units">({units})</span>
        </h4>
        <div className="twelve columns">
          <ThemeMap
            theme={selectedTheme}
            data={placeData.data[selectedTheme]}
            boundary={placeData.boundary}
            decade={selectedDecade} />
        </div>
      </div>
    );
  }
});