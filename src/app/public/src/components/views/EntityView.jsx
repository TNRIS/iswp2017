
import R from 'ramda';
import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import Spinner from 'react-spinkit';
import titleize from 'titleize';

import constants from '../../constants';
import DataViewChoiceStore from '../../stores/DataViewChoiceStore';
import DataViewChoiceWrap from '../DataViewChoiceWrap';
import DownloadDataLink from '../DownloadDataLink';
import EntityDataStore from '../../stores/EntityDataStore';
import EntityViewMap from '../maps/EntityViewMap';
import EntitySummary from '../EntitySummary';
import EntityStrategiesTable from '../EntityStrategiesTable';
import PlacePivotTable from '../PlacePivotTable';
import ProjectTable from '../ProjectTable';
import StrategiesBreakdown from '../StrategiesBreakdown';
import ThemeMaps from '../maps/ThemeMaps';
import ThemeTotalsByDecadeChart from '../charts/ThemeTotalsByDecadeChart';

export default class EntityView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      entityData: EntityDataStore.getState().entityData,
      viewChoice: DataViewChoiceStore.getState()
    }
  }

  componentDidMount = () => {
    EntityDataStore.listen(this.onEntityDataChange);
    DataViewChoiceStore.listen(this.onDataViewChoiceChange);

    this.fetchData(this.props.match.params);
  }

  componentWillReceiveProps = (nextProps) => {
    this.fetchData(nextProps.match.params);
  }

  componentWillUnmount = () => {
    EntityDataStore.unlisten(this.onEntityDataChange);
    DataViewChoiceStore.unlisten(this.onDataViewChoiceChange);
  }

  onEntityDataChange = (state) => {
    this.setState({entityData: state.entityData});
  }

  onDataViewChoiceChange = (state) => {
    this.setState({viewChoice: state});
  }

  fetchData = (params) => {
    EntityDataStore.fetch({entityId: params.entityId});
  }

  render() {
    const entityId = this.props.match.params.entityId;
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
                        <Spinner name="double-bounce" fadeIn='none' />
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
                  </div>

                    <DataViewChoiceWrap decade={this.state.viewChoice.selectedDecade}
                      theme={this.state.viewChoice.selectedTheme}>
                      <div className="container">
                        <div className="row panel-row">
                          <div className="twelve columns">
                            <span className="view-name">{title}</span>
                            <ThemeMaps placeData={entityData}
                              decade={this.state.viewChoice.selectedDecade}
                              theme={this.state.viewChoice.selectedTheme} />
                          </div>
                        </div>

                        {this.state.viewChoice.selectedTheme === 'strategies' &&
                          (
                            <div className="row panel-row">
                              <div className="twelve columns">
                                <span className="view-name">{title}</span>
                                <StrategiesBreakdown viewData={entityData.data}
                                  decade={this.state.viewChoice.selectedDecade} />
                              </div>
                            </div>
                          )
                        }

                        <div className="row panel-row">
                          <div className="twelve columns">
                            <span className="view-name">{title}</span>
                            <PlacePivotTable viewData={entityData.data}
                            decade={this.state.viewChoice.selectedDecade}
                            theme={this.state.viewChoice.selectedTheme} />
                            <h4>Download Data</h4>
                            <ul>
                              {
                                R.prepend('population', constants.THEMES).map((theme) => {
                                  if (R.isEmpty(entityData.data[theme].rows)) {
                                    return (
                                      <li key={`download-${theme}`}>
                                        No {constants.THEME_TITLES[theme]} data exists for this water user group
                                      </li>
                                    );
                                  }
                                  return (
                                    <li key={`download-${theme}`}>
                                      <DownloadDataLink
                                        type="entity"
                                        typeId={entityId}
                                        theme={theme}
                                        viewName={titleize(title) + ' WUG'} />
                                    </li>
                                  );
                                })
                              }
                            </ul>
                          </div>
                        </div>

                      </div>
                    </DataViewChoiceWrap>

                </div>
              );
            })()
          }
        </section>
      </div>
    );
  }

}

EntityView.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      entityId: PropTypes.integer
    }).isRequired
  })
};
