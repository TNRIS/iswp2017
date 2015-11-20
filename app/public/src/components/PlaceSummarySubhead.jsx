
import React from 'react';
import {Link} from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import IntersectingRegionsStore from '../stores/IntersectingRegionsStore';

export default React.createClass({
  propTypes: {
    type: React.PropTypes.string,
    typeId: React.PropTypes.string
  },

  mixins: [PureRenderMixin],

  getInitialState() {
    return IntersectingRegionsStore.getState();
  },

  componentDidMount() {
    IntersectingRegionsStore.listen(this.onGetIntersectingRegions);
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.type === 'county') {
      IntersectingRegionsStore.fetch(nextProps.typeId);
    }
  },

  componentWillUnmount() {
    IntersectingRegionsStore.unlisten(this.onGetIntersectingRegions);
  },

  onGetIntersectingRegions(state) {
    this.setState(state);
  },

  render() {
    if (this.props.type === 'region') {
      return (
        <p>
          Regional Water Planning Area in <Link to="/statewide">Texas</Link>
        </p>
      );
    }

    if (this.props.type === 'county' && this.state.intersectingRegions) {
      return (
        <p>
          County in {this.state.intersectingRegions.map((region, i) => {
            return (
              <Link key={i} to={`/region/${region}`}>Region {region.toUpperCase()}</Link>
            );
          })}
        </p>
      );
    }

    return (<div/>);
  }
});