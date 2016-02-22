
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

  onChangeNavCategory(e) {
    const val = e.target.value;
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
    default:
      return;
    }

    this.setState({subNavValue: ''});
  },

  render() {
    const regionSelectOptions = constants.REGIONS.map((region) => {
      return {value: region, label: `Region ${region}`};
    });

    const countySelectOptions = countyNames.map((name) => {
      return {value: name, label: name};
    });

    const usageTypeSelectOptions = constants.USAGE_TYPES.map((type) => {
      return {value: type.toLowerCase(), label: titleize(type)};
    });

    return (
      <div className="header-nav">
        <div className="wrapper">
          <form>
            <label htmlFor="nav-category-select">View data for</label>
            <select onChange={this.onChangeNavCategory}
              value={this.state.navCategory}
              className="nav-category-select"
              id="nav-category-select">
              <option value="statewide">All of Texas</option>
              <option value="region">Planning Region</option>
              <option value="county">County</option>
              <option value="entity">Water User Group</option>
              <option value="usagetype">Usage Type</option>
            </select>
            <ToggleDisplay show={this.state.navCategory === 'region'}>
              <div className="select-auto" aria-live="polite">
                <Select matchPos="start"
                  placeholder="Select Region"
                  ignoreCase
                  onChange={this.onSubNavChange}
                  value={this.state.subNavValue}
                  options={regionSelectOptions} />
              </div>
            </ToggleDisplay>
            <ToggleDisplay show={this.state.navCategory === 'county'}>
              <div className="select-auto" aria-live="polite">
                <Select matchPos="start"
                  placeholder="Select County"
                  ignoreCase
                  onChange={this.onSubNavChange}
                  value={this.state.subNavValue}
                  options={countySelectOptions} />
              </div>
            </ToggleDisplay>
            <ToggleDisplay show={this.state.navCategory === 'entity'}>
              <div className="select-auto entity-select" aria-live="polite">
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
              <div className="select-auto" aria-live="polite">
                <Select
                  placeholder="Select Usage Type"
                  ignoreCase
                  onChange={this.onSubNavChange}
                  value={this.state.subNavValue}
                  options={usageTypeSelectOptions} />
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