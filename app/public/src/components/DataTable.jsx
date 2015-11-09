
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {Table} from 'reactable';

import PropTypes from '../utils/CustomPropTypes';
import DecadeChoiceStore from '../stores/DecadeChoiceStore';

export default React.createClass({
  propTypes: {
    placeData: PropTypes.PlaceData
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
    //TODO: Sorting - see https://github.com/facebook/fixed-data-table/blob/master/site/examples/SortExample.js
    //TODO: Switcher to change the year of data
    //TODO: Show all themes in the table?
    const placeData = this.props.placeData;
    if (!placeData || !placeData.data) {
      return (
        <div />
      );
    }

    const tableData = placeData.data.demands.rows;
    const decade = this.state.selectedDecade;

    return (
      <div>
        <h4>Raw Data - {decade}</h4>
        <div className="table-container">
          <Table className="data-table u-full-width"
            data={tableData}
            sortable
          />
        </div>
      </div>
    );
  }
});

