
import React from 'react';
import {Link} from 'react-router';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import intersperse from 'intersperse';

import {formatCountyName} from '../utils/CountyNames';
import ParentPlaceStore from '../stores/ParentPlaceStore';

export default React.createClass({
  propTypes: {
    entityId: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.number
    ])
  },

  mixins: [PureRenderMixin],

  getInitialState() {
    return {};
  },

  componentDidMount() {
    ParentPlaceStore.listen(this.onGetParentPlace);

    //The setTimeout is a hack to deal with the "dispatch in dispatch" error
    setTimeout(() => {
      ParentPlaceStore.fetch('entity', this.props.entityId);
    });
  },

  componentWillUnmount() {
    ParentPlaceStore.unlisten(this.onGetParentPlace);
  },

  onGetParentPlace(state) {
    this.setState(state);
  },

  render() {
    if (ParentPlaceStore.isLoading() || !this.props.entityId) {
      return (<p/>);
    }

    if (this.state.parentPlaces) {
      const links = this.state.parentPlaces.map((county, i) => {
        const countyName = formatCountyName(county);
        return (
          <Link key={i} to={`/county/${countyName}`} title={`View ${countyName} County`}>
            {countyName}
          </Link>
        );
      });

      if (!links || !links.length) {
        return (<div/>);
      }

      if (links.length === 1) {
        return (<p>Water User Group in {links[0]}</p>);
      }
      else if (links.length === 2) {
        return (<p>Water User Group in {intersperse(links, " and ")}</p>);
      }
      //else
      const interspersed = intersperse(links, ", ");
      interspersed[interspersed.length - 2] = ", and ";
      return (<p>Water User Group in {interspersed}</p>);
    }

    return (<div/>);
  }
});