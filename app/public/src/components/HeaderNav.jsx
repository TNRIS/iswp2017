
import R from 'ramda';
import React from 'react';
import Select from 'react-select';
import ToggleDisplay from 'react-toggle-display';
import titleize from 'titleize';

import constants from '../constants';
import {countyNames} from '../utils/CountyNames';
import history from '../history';
import ViewStateStore from '../stores/ViewStateStore';
import EntityFetcher from '../utils/EntityFetcher';
import ProjectFetcher from '../utils/ProjectFetcher';
import {sourceNames} from '../utils/SourceNames';

const navCategoryOptions = [
  {value: "statewide", label: "All of Texas"},
  {value: "region", label: "Planning Region"},
  {value: "county", label: "County"},
  {value: "entity", label: "Water User Group"},
  {value: "usagetype", label: "Usage Type"},
  {value: "source", label: "Water Source"},
  {value: "project", label: "WMS Project"}
]

const regionSelectOptions = constants.REGIONS.map((region) => {
  return {value: region, label: `Region ${region}`};
});

const countySelectOptions = countyNames.map((name) => {
  return {value: name, label: name};
});

const usageTypeSelectOptions = constants.USAGE_TYPES.map((type) => {
  return {value: type.toLowerCase(), label: titleize(type)};
});

const sourceSelectOptions = sourceNames.map((src) => {
  return {value: src.sourceid, label: src.name};
});

export default React.createClass({
  getInitialState() {
    const viewState = ViewStateStore.getState().viewState;
    return {
      navButtonEnabled: viewState.view === 'statewide',
      navCategory: viewState.view,
      subNavValue: ''
    };
  },

  componentDidMount() {
    ViewStateStore.listen(this.onViewStateChange);
  },

  componentWillUnmount() {
    ViewStateStore.unlisten(this.onViewStateChange);
  },

  onViewStateChange(storeState) {
    this.setState({
      navCategory: storeState.viewState.view,
      subNavValue: ''
    });
  },

  onChangeNavCategory(val) {
    this.setState({
      navCategory: val,
      subNavValue: ''
    });
  },

  onSubNavChange(val, matches) {
    if (!R.isEmpty(val)) {
      this.setState({subNavValue: R.nth(0, matches)});
    }
    else {
      this.setState({subNavValue: ''});
    }
  },

  entitySearch(input, callback) {
    if (input.length < 3) {
      return callback(null, {options: []});
    }

    EntityFetcher.search(input)
      .then((entities) => {
        const options = entities.map((entity) => {
          return {value: entity.EntityId, label: entity.EntityName};
        });
        callback(null, {options});
      })
      .catch((err) => {
        callback(err);
      });
  },

  projectSearch(input, callback) {
    if (input.length < 3) {
      return callback(null, {options: []});
    }

    ProjectFetcher.search(input)
      .then((projects) => {
        const options = projects.map((project) => {
          return {value: project.WmsProjectId, label: project.ProjectName};
        });
        callback(null, {options});
      })
      .catch((err) => {
        callback(err);
      });
  },

  isNavButtonEnabled() {
    return (this.state.navCategory === 'statewide')
      || !R.isEmpty(this.state.subNavValue);
  },

  navigate() {
    switch (this.state.navCategory) {
    case 'statewide':
      history.push({pathname: '/statewide'});
      break;
    case 'county':
      history.push({pathname: `/county/${this.state.subNavValue.value}`});
      break;
    case 'region':
      history.push({pathname: `/region/${this.state.subNavValue.value}`});
      break;
    case 'entity':
      history.push({pathname: `/entity/${this.state.subNavValue.value}`});
      break;
    case 'usagetype':
      history.push({pathname: `/usagetype/${this.state.subNavValue.value}`});
      break;
    case 'source':
      history.push({pathname: `/source/${this.state.subNavValue.value}`});
      break;
    case 'project':
      history.push({pathname: `/project/${this.state.subNavValue.value}`});
      break;
    default:
      return;
    }

    this.setState({subNavValue: ''});
  },

  render() {
    return (
      <div className="header-nav">
        <div className="wrapper">
          <form>
            <label htmlFor="nav-category-select">View data for</label>
            <div className="select-container category-select" aria-live="polte">
              <Select className="nav-category-select"
                id="nav-category-select"
                ignoreCase
                clearable={false}
                onChange={this.onChangeNavCategory}
                value={this.state.navCategory}
                options={navCategoryOptions} />
            </div>
            <ToggleDisplay show={this.state.navCategory === 'region'}>
              <div className="select-container" aria-live="polite">
                <Select matchPos="start"
                  placeholder="Select Region"
                  ignoreCase
                  clearable={false}
                  onChange={this.onSubNavChange}
                  value={this.state.subNavValue}
                  options={regionSelectOptions} />
              </div>
            </ToggleDisplay>
            <ToggleDisplay show={this.state.navCategory === 'county'}>
              <div className="select-container" aria-live="polite">
                <Select matchPos="start"
                  placeholder="Select County"
                  ignoreCase
                  onChange={this.onSubNavChange}
                  value={this.state.subNavValue}
                  options={countySelectOptions} />
              </div>
            </ToggleDisplay>
            <ToggleDisplay show={this.state.navCategory === 'entity'}>
              <div className="select-container entity-select" aria-live="polite">
                <Select
                  placeholder="Find Water User Group"
                  ignoreCase
                  autoload={false}
                  searchPromptText="Enter at least 3 characters to search"
                  asyncOptions={this.entitySearch}
                  onChange={this.onSubNavChange}
                  value={this.state.subNavValue} />
              </div>
            </ToggleDisplay>
            <ToggleDisplay show={this.state.navCategory === 'usagetype'}>
              <div className="select-container" aria-live="polite">
                <Select
                  placeholder="Select Usage Type"
                  ignoreCase
                  onChange={this.onSubNavChange}
                  value={this.state.subNavValue}
                  options={usageTypeSelectOptions} />
              </div>
            </ToggleDisplay>
            <ToggleDisplay show={this.state.navCategory === 'source'}>
              <div className="select-container" aria-live="polite">
                <Select
                  placeholder="Select Water Source"
                  ignoreCase
                  onChange={this.onSubNavChange}
                  value={this.state.subNavValue}
                  options={sourceSelectOptions} />
              </div>
            </ToggleDisplay>
            <ToggleDisplay show={this.state.navCategory === 'project'}>
              <div className="select-container project-select" aria-live="polite">
                <Select
                  placeholder="Find Project"
                  ignoreCase
                  autoload={false}
                  searchPromptText="Enter at least 3 characters to search"
                  asyncOptions={this.projectSearch}
                  onChange={this.onSubNavChange}
                  value={this.state.subNavValue} />
              </div>
            </ToggleDisplay>

            <button type="submit" className="button button-nav-submit"
              disabled={!this.isNavButtonEnabled()}
              onClick={this.navigate}>
              Go
            </button>
          </form>
        </div>
      </div>
    );
  }
});