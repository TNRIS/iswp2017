
import R from 'ramda';
import React from 'react';
import Helmet from 'react-helmet';
import Spinner from 'react-spinkit';

import constants from '../../constants';
import DownloadDataLink from '../DownloadDataLink';
import EntityDataStore from '../../stores/EntityDataStore';
import EntityViewMap from '../maps/EntityViewMap';
import EntitySummary from '../EntitySummary';
import EntityStrategiesTable from '../EntityStrategiesTable';
import ProjectTable from '../ProjectTable';
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

  render() {
    const entityId = this.props.params.entityId;
    const entityData = this.state.entityData;
    const title = entityData.entity ? entityData.entity.EntityName
      : '';

    return (
      <div className="entity-view">
        <Helmet title={title} />
        <section>
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

                    <div className="row panel-row">
                      <div className="twelve columns">
                        <span className="view-name">{title}</span>
                        <EntityStrategiesTable viewData={entityData.data} />
                      </div>
                    </div>

                    <div className="row panel-row">
                      <div className="twelve columns">
                        <span className="view-name">{title}</span>
                        <ProjectTable type="entity" projectData={entityData.data.projects} />
                      </div>
                    </div>

                    <div className="row panel-row">
                      <div className="twelve columns">
                        <span className="view-name">{title}</span>
                        <h4>Download Data</h4>
                        <ul>
                          {
                            R.prepend('population', constants.THEMES).map((theme) => {
                              if (R.isEmpty(entityData.data[theme].rows)) {
                                return (
                                  <li key={`download-${theme}`}>
                                    No {constants.THEME_TITLES[theme]} data exist for this water user group
                                  </li>
                                );
                              }
                              return (
                                <li key={`download-${theme}`}>
                                  <DownloadDataLink
                                    type="entity"
                                    typeId={entityId}
                                    theme={theme} />
                                </li>
                              );
                            })
                          }
                        </ul>
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