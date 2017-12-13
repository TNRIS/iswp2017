
import R from 'ramda';
import React from 'react';
import Select from 'react-select';
import ToggleDisplay from 'react-toggle-display';
import titleize from 'titleize';
import classnames from 'classnames';
import debounce from 'debounce';

import constants from '../constants';
import {countyNames} from '../utils/CountyNames';
import history from '../history';
import ViewStateStore from '../stores/ViewStateStore';
import EntityFetcher from '../utils/EntityFetcher';
import ProjectFetcher from '../utils/ProjectFetcher';
import {sourceNames} from '../utils/SourceNames';
import WmsTypes from '../constants/WmsTypes';
import WMSFetcher from '../utils/WMSFetcher';

const navCategoryOptions = [
  {value: "statewide", label: "All of Texas"},
  {value: "region", label: "Planning Region"},
  {value: "county", label: "County"},
  {value: "entity", label: "Water User Group"},
  {value: "usagetype", label: "Usage Type"},
  {value: "source", label: "Water Source"},
  {value: "project", label: "WMS Project"},
  {value: "wms", label: "Water Management Strategy"},
  {value: "wmstype", label: "WMS Type"}
];


export default class HeaderNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navButtonEnabled: this.props.view === 'statewide',
      navCategory: this.props.view,
      subNavValue: '',
      isStuck: false
    }
  }

  componentDidMount = () => {
    window.addEventListener('scroll', this.handleScroll);
    //use debounced version for window resize
    this.debouncedHandleScroll = debounce(this.handleScroll, 200);
    window.addEventListener('resize', this.debouncedHandleScroll);

    ViewStateStore.listen(this.onViewStateChange);
  }

  componentWillUnmount = () => {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.debouncedHandleScroll);
    ViewStateStore.unlisten(this.onViewStateChange);
  }

  handleScroll = () => {
    if (!this.shouldCheckStick()) {
      this.setState({isStuck: false});
      return;
    }

    const y = document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (!this.refs.headerNav) {
      return;
    }

    const stickyTop = this.refs.headerNav.offsetTop;
    if (y >= stickyTop) {
      this.setState({isStuck: true});
    }
    else {
      this.setState({isStuck: false});
    }
  };

  shouldCheckStick = () => {
    return window.matchMedia("(min-width: 550px)").matches;
  };

  onViewStateChange = (storeState) => {
    this.setState({
      navCategory: storeState.viewState.view,
      subNavValue: ''
    });
  }

  onChangeNavCategory = (selection) => {
    this.setState({
      navCategory: selection.value,
      subNavValue: ''
    });
  }

  onSubNavChange = (selection) => {
    if (!R.isEmpty(selection)) {
      this.setState({subNavValue: selection});
    } else {
      this.setState({subNavValue: ''});
    }
  }

  regionSelectOptions = (input, callback) => {
    setTimeout(() => {
      callback(null, {
        options: constants.REGIONS.map((region) => {
          return {value: region, label: `Region ${region}`};
        }),
        complete: true
      });
    }, 500);
  };

  countySelectOptions = (input, callback) => {
    setTimeout(() => {
      callback(null, {
        options: countyNames.map((name) => {
          return {value: name, label: name};
        }),
        complete: true
      });
    }, 500);
  };

  usageTypeSelectOptions = (input, callback) => {
    setTimeout(() => {
      callback(null, {
        options: constants.USAGE_TYPES.map((type) => {
          return {value: type.toLowerCase(), label: titleize(type)};
        }),
        complete: true
      });
    }, 500);
  };

  sourceSelectOptions = (input, callback) => {
    setTimeout(() => {
      callback(null, {
        options: sourceNames.map((src) => {
          return {value: src.sourceid, label: src.name};
        }),
        complete: true
      });
    }, 500);
  };

  entitySearch = (input, callback) => {
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
  }

  projectSearch = (input, callback) => {
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
  }

  wmsSearch = (input, callback) => {
    if (input.length < 3) {
      return callback(null, {options: []});
    }

    WMSFetcher.search(input)
      .then((wmses) => {
        const options = wmses.map((wms) => {
            return {value: wms.WmsId, label: wms.WmsName};
        });
        callback(null, {options: R.uniq(options)});
      })
      .catch((err) => {
        callback(err);
      });
  }

  wmsTypeSelectOptions = (input, callback) => {
    setTimeout(() => {
      callback(null, {
        options: WmsTypes.WMS_TYPES.map((type) => {
          return {value: type, label: titleize(type)};
        }),
        complete: true
      });
    }, 500);
  };

  isNavButtonEnabled = () => {
    return (this.state.navCategory === 'statewide') || !R.isEmpty(this.state.subNavValue);
  }

  navigate = () => {
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
    case 'wms':
      history.push({pathname: `/wms/${this.state.subNavValue.value}`});
      break;
    case 'wmstype':
      history.push({pathname: `/wmstype/${this.state.subNavValue.value}`});
      break;
    default:
      break;
    }
    this.setState({subNavValue: ''});
  }

  render() {
    const wrapStyle = {};
    if (this.shouldCheckStick() && this.state.isStuck) {
      wrapStyle.paddingTop = this.refs.stickyEl.offsetHeight * 1.20;
    }

    return (
      <div style={wrapStyle} ref="headerNav">
      <div className={classnames("header-nav", {"sticky-nav-header": this.state.isStuck})} ref="stickyEl">
        <div className={classnames("wrapper")}>
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
                <Select.Async matchPos="start"
                  placeholder="Select Region"
                  ignoreCase
                  clearable={false}
                  onChange={this.onSubNavChange}
                  value={this.state.subNavValue}
                  loadOptions={this.regionSelectOptions} />
              </div>
            </ToggleDisplay>
            <ToggleDisplay show={this.state.navCategory === 'county'}>
              <div className="select-container" aria-live="polite">
                <Select.Async matchPos="start"
                  placeholder="Select County"
                  ignoreCase
                  onChange={this.onSubNavChange}
                  value={this.state.subNavValue}
                  loadOptions={this.countySelectOptions} />
              </div>
            </ToggleDisplay>
            <ToggleDisplay show={this.state.navCategory === 'entity'}>
              <div className="select-container entity-select" aria-live="polite">
                <Select.Async
                  placeholder="Find Water User Group"
                  ignoreCase
                  autoload={false}
                  searchPromptText="Enter at least 3 characters to search"
                  loadOptions={this.entitySearch}
                  onChange={this.onSubNavChange}
                  value={this.state.subNavValue} />
              </div>
            </ToggleDisplay>
            <ToggleDisplay show={this.state.navCategory === 'usagetype'}>
              <div className="select-container" aria-live="polite">
                <Select.Async
                  placeholder="Select Usage Type"
                  ignoreCase
                  onChange={this.onSubNavChange}
                  value={this.state.subNavValue}
                  loadOptions={this.usageTypeSelectOptions} />
              </div>
            </ToggleDisplay>
            <ToggleDisplay show={this.state.navCategory === 'source'}>
              <div className="select-container" aria-live="polite">
                <Select.Async
                  placeholder="Select Water Source"
                  ignoreCase
                  onChange={this.onSubNavChange}
                  value={this.state.subNavValue}
                  loadOptions={this.sourceSelectOptions} />
              </div>
            </ToggleDisplay>
            <ToggleDisplay show={this.state.navCategory === 'project'}>
              <div className="select-container project-select" aria-live="polite">
                <Select.Async
                  placeholder="Find Project"
                  ignoreCase
                  autoload={false}
                  searchPromptText="Enter at least 3 characters to search"
                  loadOptions={this.projectSearch}
                  onChange={this.onSubNavChange}
                  value={this.state.subNavValue} />
              </div>
            </ToggleDisplay>
            <ToggleDisplay show={this.state.navCategory === 'wmstype'}>
              <div className="select-container" aria-live="polite">
                <Select.Async
                  placeholder="Select WMS Type"
                  ignoreCase
                  onChange={this.onSubNavChange}
                  value={this.state.subNavValue}
                  loadOptions={this.wmsTypeSelectOptions} />
              </div>
            </ToggleDisplay>
            <ToggleDisplay show={this.state.navCategory === 'wms'}>
              <div className="select-container project-select" aria-live="polite">
                <Select.Async
                  placeholder="Find WMS"
                  ignoreCase
                  autoload={false}
                  searchPromptText="Enter at least 3 characters to search"
                  loadOptions={this.wmsSearch}
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
      </div>
    );
  }
}
