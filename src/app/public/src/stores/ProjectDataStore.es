
import alt from '../alt';
import ProjectDataActions from '../actions/ProjectDataActions';
import DataFetcher from '../utils/DataFetcher';
import ProjectFetcher from '../utils/ProjectFetcher';

export const ProjectDataSource = {
  // "fetch" will become a method on ProjectDataStore --> ProjectDataStore.fetch({projectId})
  fetch: {
    remote(state, params) {
      return Promise.all([
        DataFetcher.fetch({type: 'project', typeId: params.projectId}),
        ProjectFetcher.fetch({projectId: params.projectId})
      ]).then(([data, project]) => {
        return {data, project};
      });
    },

    success: ProjectDataActions.updateProjectData,
    error: ProjectDataActions.fetchProjectDataFailed,
    loading: ProjectDataActions.fetchProjectData
  }
};

class ProjectDataStore {
  constructor() {
    this.projectData = {};
    this.errorMessage = null;

    this.registerAsync(ProjectDataSource);

    this.bindListeners({
      handleUpdateData: ProjectDataActions.UPDATE_PROJECT_DATA,
      handleFetchData: ProjectDataActions.FETCH_PROJECT_DATA,
      handleFetchDataFailed: ProjectDataActions.FETCH_PROJECT_DATA_FAILED
    });
  }

  handleUpdateData(projectData) {
    this.projectData = projectData;
  }

  handleFetchData() {
    //reset to new empty object during fetch
    this.projectData = {};
    this.errorMessage = null;
  }

  handleFetchDataFailed(errorMessage) {
    this.errorMessage = errorMessage;
  }
}

export default alt.createStore(ProjectDataStore, 'ProjectDataStore');
