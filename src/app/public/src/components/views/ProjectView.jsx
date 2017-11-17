import R from 'ramda';
import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import Spinner from 'react-spinkit';

import constants from '../../constants';
import DownloadDataLink from '../DownloadDataLink';
import DataViewChoiceStore from '../../stores/DataViewChoiceStore';
import ProjectPivotTable from '../ProjectPivotTable';
import ProjectDataStore from '../../stores/ProjectDataStore';
import ProjectViewMap from '../maps/ProjectViewMap';
import ProjectSummary from '../ProjectSummary';
import ProjectTable from '../ProjectTable';
import PrjDataViewChoiceWrap from '../PrjDataViewChoiceWrap';
import ThemeMaps from '../maps/ThemeMaps';

export default class ProjectView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectData: ProjectDataStore.getState().projectData,
      viewChoice: DataViewChoiceStore.getState()
    }
  }

  componentDidMount = () => {
    ProjectDataStore.listen(this.onProjectDataChange);
    DataViewChoiceStore.listen(this.onDataViewChoiceChange);

    this.fetchProjectData(this.props.match.params);
  }

  componentWillReceiveProps = (nextProps) => {
    // Route params are in this.props, and when route changes the data
    // need to be fetched again
    this.fetchProjectData(nextProps.match.params);
  }

  componentWillUnmount = () => {
    ProjectDataStore.unlisten(this.onProjectDataChange);
    DataViewChoiceStore.unlisten(this.onDataViewChoiceChange);
  }

  onProjectDataChange = (state) => {
    this.setState({projectData: state.projectData});
  }

  onDataViewChoiceChange = (state) => {
    this.setState({viewChoice: state});
  }

  fetchProjectData = (params) => {
    ProjectDataStore.fetch({
      projectId: params.projectId
    });
  }

  render() {
    const projectData = this.state.projectData;
    const title = projectData.project ? projectData.project.ProjectName : '';
    const selectedTheme = "strategies";

    return (
      <div className="project-view">

      <Helmet title={title} />

        <section>
          <div className="view-top source-view-top">
            <div className="summary-wrapper container">
              <ProjectSummary projectData={projectData} />
            </div>
            <ProjectViewMap projectData={projectData} />
          </div>

          {
            (() => {
              if (!projectData || R.isEmpty(R.keys(projectData))) {
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
                              <ProjectTable type="project" projectData={projectData.data.wms.rows}/>
                          </div>
                      </div>
                  </div>
                  <PrjDataViewChoiceWrap decade={this.state.viewChoice.selectedDecade}
                    theme={selectedTheme}>
                    <div className="container">

                      <div className="row panel-row">
                        <div className="twelve columns">
                          <span className="view-name">{title}</span>
                          <ThemeMaps placeData={projectData}
                            decade={this.state.viewChoice.selectedDecade}
                            theme={selectedTheme} />
                        </div>
                      </div>

                      <div className="row panel-row">
                        <div className="twelve columns">
                          <span className="view-name">{title}</span>
                          <ProjectPivotTable viewData={projectData.data}
                          decade={this.state.viewChoice.selectedDecade}
                          theme={selectedTheme} />
                          <h4>Download Data</h4>
                          <ul>
                            {
                              (() => {
                                if (R.isEmpty(projectData.data[selectedTheme].rows)) {
                                  return (
                                    <li key={`download-${selectedTheme}`}>
                                      No {constants.THEME_TITLES[selectedTheme]} data exists for this water management strategy project
                                    </li>
                                  );
                                }
                                return (
                                  <li key={`download-${selectedTheme}`}>
                                    <DownloadDataLink
                                      type="project"
                                      typeId={projectData.project.WmsProjectId}
                                      theme={selectedTheme} />
                                  </li>
                                );
                              })()
                            }
                          </ul>
                        </div>
                      </div>

                    </div>
                  </PrjDataViewChoiceWrap>
                </div>
              );
            })()
          }

        </section>

      </div>
    );
  }
}

ProjectView.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      projectId: PropTypes.integer
    }).isRequired
  })
};
