
import PropTypes from 'prop-types';
import React from 'react';
import createReactClass from 'create-react-class';
import {Link} from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import intersperse from 'intersperse';

import ParentPlaceStore from '../stores/ParentPlaceStore';

export default createReactClass({
  displayName: 'PlaceSummarySubhead',

  propTypes: {
    type: PropTypes.string,
    typeId: PropTypes.string
  },

  mixins: [PureRenderMixin],

  getInitialState() {
    return {};
  },

  componentDidMount() {
    ParentPlaceStore.listen(this.onGetParentPlace);

    //The setTimeout is a hack to deal with the "dispatch in dispatch" error
    if (this.props.type === 'county') {
      setTimeout(() => {
        ParentPlaceStore.fetch('county', this.props.typeId);
      });
    }
  },

  componentWillUnmount() {
    ParentPlaceStore.unlisten(this.onGetParentPlace);
  },

  onGetParentPlace(state) {
    this.setState(state);
  },

  render() {
    if (this.props.type === 'region') {
      return (
        <p>
          Regional Water Planning Area in <Link to="/statewide" title="View Texas">Texas</Link>
        </p>
      );
    }

    if (ParentPlaceStore.isLoading()) {
      return (<p/>);
    }

    if (this.props.type === 'county' && this.state.parentPlaces) {
      const links = this.state.parentPlaces.map((region, i) => {
        return (
          <Link key={i} to={`/region/${region}`} title={`View Region ${region.toUpperCase()}`}>
            Region {region.toUpperCase()}
          </Link>
        );
      });

      if (!links || !links.length) {
        return (<div/>);
      }

      if (links.length === 1) {
        return (<p>County in {links[0]}</p>);
      }
      else if (links.length === 2) {
        return (<p>County in {intersperse(links, " and ")}</p>);
      }
      //else
      const interspersed = intersperse(links, ", ");
      interspersed[interspersed.length - 2] = ", and ";
      return (<p>County in {interspersed}</p>);
    }

    return (<div/>);
  },
});