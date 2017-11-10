
import R from 'ramda';
import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import Spinner from 'react-spinkit';
import titleize from 'titleize';

import constants from '../../constants';
import DataViewChoiceActions from '../../actions/DataViewChoiceActions';
import DataViewChoiceStore from '../../stores/DataViewChoiceStore';
import DataViewChoiceWrap from '../DataViewChoiceWrap';
import DownloadDataLink from '../DownloadDataLink';
import PlacePivotTable from '../PlacePivotTable';
import StrategiesBreakdown from '../StrategiesBreakdown';
import ThemeTotalsByDecadeChart from '../charts/ThemeTotalsByDecadeChart';
import ThemeMaps from '../maps/ThemeMaps';
import UsageTypeSummary from '../UsageTypeSummary';
import UsageTypeDataStore from '../../stores/UsageTypeDataStore';
import ViewStateStore from '../../stores/ViewStateStore';

export default class UsageTypeView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewData: UsageTypeDataStore.getState().data,
      viewChoice: DataViewChoiceStore.getState(),
      hidePopulation: this.shouldHidePopulation(ViewStateStore.getState().viewState)
    }
  }

  componentDidMount = () => {
    UsageTypeDataStore.listen(this.onViewDataChange);
    DataViewChoiceStore.listen(this.onDataViewChoiceChange);
    ViewStateStore.listen(this.onViewStateChange);
    this.fetchViewData(this.props.match.params);
  }

  componentWillReceiveProps = (nextProps) => {
    this.fetchViewData(nextProps.match.params);
  }

  componentDidUpdate = () => {
    //if population theme selection is hidden but it is the currently selected theme,
    // then update the theme choice to 'needs'
    if (this.state.hidePopulation && this.state.viewChoice.selectedTheme === 'population') {
      DataViewChoiceActions.updateThemeChoice('needs');
    }
  }

  componentWillUnmount = () => {
    UsageTypeDataStore.unlisten(this.onViewDataChange);
    DataViewChoiceStore.unlisten(this.onDataViewChoiceChange);
    ViewStateStore.unlisten(this.onViewStateChange);
  }

  onViewDataChange = (state) => {
    this.setState({viewData: state.data});
  }

  onViewStateChange = (storeState) => {
    this.setState({hidePopulation: this.shouldHidePopulation(storeState.viewState)});
  }

  onDataViewChoiceChange = (state) => {
    this.setState({viewChoice: state});
  }

  fetchViewData = (params) => {
    UsageTypeDataStore.fetch({typeId: params.typeId});
  }

  shouldHidePopulation = (viewState) => {
    return viewState && viewState.id !== 'municipal';
  }

  render() {
    const viewData = this.state.viewData;
    const usageType = this.props.match.params.typeId;

    const title = titleize(usageType) + ' Usage';
    const viewName = titleize(usageType);
    const themeKeys = this.state.hidePopulation ?
      constants.THEMES
      : R.prepend('population', constants.THEMES);

    return (
      <div className="usage-type-view">
        <Helmet title={title} />
        <section>
          <div className="view-top usage-type-view-top">
            <div className="summary-wrapper container">
              <UsageTypeSummary viewData={viewData} usageType={usageType} />
            </div>
          </div>

          {
            (() => {
              if (!viewData || R.isEmpty(R.keys(viewData))) {
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
                        <span className="view-name">{viewName}</span>
                        <ThemeTotalsByDecadeChart viewData={viewData} />
                      </div>
                    </div>
                  </div>

                  <DataViewChoiceWrap decade={this.state.viewChoice.selectedDecade}
                    theme={this.state.viewChoice.selectedTheme}
                    hidePopulation={this.state.hidePopulation}>

                    <div className="container">
                      <div className="row panel-row">
                        <div className="twelve columns">
                          <span className="view-name">{viewName}</span>
                          <ThemeMaps placeData={{data: viewData}}
                            decade={this.state.viewChoice.selectedDecade}
                            theme={this.state.viewChoice.selectedTheme} />
                        </div>
                      </div>

                      {this.state.viewChoice.selectedTheme === 'strategies' &&
                        (
                          <div className="row panel-row">
                            <div className="twelve columns">
                              <span className="view-name">{viewName}</span>
                              <StrategiesBreakdown viewData={viewData}
                                decade={this.state.viewChoice.selectedDecade} />
                            </div>
                          </div>
                        )
                      }

                      <div className="row panel-row">
                        <div className="twelve columns">
                          <span className="view-name">{viewName}</span>
                          <PlacePivotTable viewData={viewData}
                            decade={this.state.viewChoice.selectedDecade}
                            theme={this.state.viewChoice.selectedTheme} />
                          <h5>Download Data</h5>
                          <ul>
                            {
                              themeKeys.map((theme) => {
                                if (R.isEmpty(viewData)) {
                                  return (
                                    <li key={`download-${theme}`}>
                                      No {constants.THEME_TITLES[theme]} data exists for {viewName} Usage Type
                                    </li>
                                  );
                                }
                                return (
                                  <li key={`download-${theme}`}>
                                    <DownloadDataLink
                                      type="usagetype"
                                      typeId={usageType}
                                      theme={theme}
                                      viewName={viewName} />
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

UsageTypeView.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      typeId: PropTypes.string
    }).isRequired
  })
};
