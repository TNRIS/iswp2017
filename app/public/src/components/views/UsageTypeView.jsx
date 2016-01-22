
import R from 'ramda';
import React from 'react';
import Helmet from 'react-helmet';
import Spinner from 'react-spinkit';
import titleize from 'titleize';

export default React.createClass({
  propTypes: {
    params: React.PropTypes.shape({
      typeId: React.PropTypes.string
    }).isRequired
  },

  getInitialState() {
    // return EntityDataStore.getState();
    return {};
  },

  componentDidMount() {
    // EntityDataStore.listen(this.onChange);

    this.fetchData(this.props.params);
  },

  componentWillReceiveProps(nextProps) {
    this.fetchData(nextProps.params);
  },

  componentWillUnmount() {
    // EntityDataStore.unlisten(this.onChange);
  },

  onChange(state) {
    this.setState(state);
  },

  fetchData(params) {
    // Fetch statewide data
    // EntityDataStore.fetch({entityId: params.entityId});
  },

  render() {
    // const entityData = this.state.entityData;
    // const title = entityData.entity ? entityData.entity.EntityName
    //   : '';

    const title = titleize(this.props.params.typeId) + ' Usage';

    return (
      <div className="usage-type-view">
        <Helmet title={title} />
        <section className="main-content">
          <div className="view-top usage-type-view-top">
            <div className="summary-wrapper wrapper">
              {this.props.params.typeId}
              {/* <EntitySummary entityData={entityData} /> */}
            </div>
            {/* <EntityViewMap entityData={entityData} /> */}
          </div>


        </section>
      </div>
    );
  }

});