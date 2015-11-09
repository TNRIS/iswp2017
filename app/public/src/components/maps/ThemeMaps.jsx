
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

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

    return (
      <div>
        <h4>Maps - {decade}</h4>
        <div className="row">
          <div className="six columns">
            <ThemeMap theme={"demands"} data={placeData.data.demands} boundary={placeData.boundary} decade={decade} />
          </div>
          <div className="six columns">
            <ThemeMap theme={"supplies"} data={placeData.data.supplies} boundary={placeData.boundary} decade={decade} />
          </div>
        </div>
        <div className="row">
          <div className="six columns">
            <ThemeMap theme={"needs"} data={placeData.data.needs} boundary={placeData.boundary} decade={decade} />
          </div>
          <div className="six columns">
            <ThemeMap theme={"strategies"} data={placeData.data.strategies} boundary={placeData.boundary} decade={decade} />
          </div>
        </div>
      </div>
    );
  }
});