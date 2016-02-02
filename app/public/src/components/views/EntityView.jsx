
import R from 'ramda';
import React from 'react';
import Helmet from 'react-helmet';
import Spinner from 'react-spinkit';

import EntityDataStore from '../../stores/EntityDataStore';

import EntityViewMap from '../maps/EntityViewMap';
import EntitySummary from '../EntitySummary';
import ThemeTotalsByDecadeChart from '../charts/ThemeTotalsByDecadeChart';

export default React.createClass({
  propTypes: {
    params: React.PropTypes.shape({
      entityId: React.PropTypes.integer
    }).isRequired
  },

  getInitialState() {
    return EntityDataStore.getState();
  },

  componentDidMount() {
    EntityDataStore.listen(this.onChange);

    this.fetchData(this.props.params);
  },

  componentWillReceiveProps(nextProps) {
    this.fetchData(nextProps.params);
  },

  componentWillUnmount() {
    EntityDataStore.unlisten(this.onChange);
  },

  onChange(state) {
    this.setState(state);
  },

  fetchData(params) {
    EntityDataStore.fetch({entityId: params.entityId});
  },

  scrollToMainContent(e) {
    e.stopPropagation();
    e.preventDefault();
    this.refs['main-content'].scrollIntoView();
  },

  render() {
    const entityData = this.state.entityData;
    const title = entityData.entity ? entityData.entity.EntityName
      : '';

    return (
      <div className="entity-view">
        <Helmet title={title} />
        <a onClick={this.scrollToMainContent} className="skip-link" href="#main-content" tabIndex="1" title="Skip to main content">Skip to Main Content</a>
        <section id="main-content" ref="main-content">
          <div className="view-top entity-view-top">
            <div className="summary-wrapper container">
              <EntitySummary entityData={entityData} />
            </div>
            <EntityViewMap entityData={entityData} />
          </div>

          {
            (() => {
              if (!entityData || R.isEmpty(R.keys(entityData))) {
                return (
                  <div className="container">
                    <div className="row panel-row">
                      <div className="twelve columns">
                        <Spinner spinnerName="double-bounce" noFadeIn />
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div>
                  <div className="container">
                    <div className="row panel-row">
                      <div className="twelve columns">
                        <span className="view-name">{title}</span>
                        <ThemeTotalsByDecadeChart viewData={entityData.data} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()
          }
        </section>
      </div>
    );
  }

});