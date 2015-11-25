
import React from 'react';
import {Link} from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import intersperse from 'intersperse';

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

    //TODO: the setTimeout is a hack to deal with the dispatch in dispatch error
    //This is also slow and there will be a flicker
    setTimeout(() => {
      IntersectingRegionsStore.fetch(this.props.typeId);
    });
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

    if (IntersectingRegionsStore.isLoading()) {
      return (<p/>);
    }

    if (this.props.type === 'county' && this.state.intersectingRegions) {
      const links = this.state.intersectingRegions.map((region, i) => {
        return (
          <Link key={i} to={`/region/${region}`}>Region {region.toUpperCase()}</Link>
        );
      });

      return (
        <p>
          County in {intersperse(links, ", ")}
        </p>
      );
    }

    return (<div/>);
  }
});