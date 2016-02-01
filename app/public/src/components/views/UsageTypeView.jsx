
import R from 'ramda';
import React from 'react';
import Helmet from 'react-helmet';
import Spinner from 'react-spinkit';
import titleize from 'titleize';

import DataViewChoiceActions from '../../actions/DataViewChoiceActions';
import DataViewChoiceStore from '../../stores/DataViewChoiceStore';
import DataViewChoiceWrap from '../DataViewChoiceWrap';
import PlacePivotTable from '../PlacePivotTable';
import ThemeTotalsByDecadeChart from '../charts/ThemeTotalsByDecadeChart';
import ThemeMaps from '../maps/ThemeMaps';
import UsageTypeSummary from '../UsageTypeSummary';
import UsageTypeDataStore from '../../stores/UsageTypeDataStore';
import ViewStateStore from '../../stores/ViewStateStore';

export default React.createClass({
  propTypes: {
    params: React.PropTypes.shape({
      typeId: React.PropTypes.string
    }).isRequired
  },

  getInitialState() {
    return {
      viewData: UsageTypeDataStore.getState().data,
      viewChoice: DataViewChoiceStore.getState(),
      hidePopulation: this.shouldHidePopulation(ViewStateStore.getState().viewState)
    };
  },

  componentDidMount() {
    UsageTypeDataStore.listen(this.onViewDataChange);
    DataViewChoiceStore.listen(this.onDataViewChoiceChange);
    ViewStateStore.listen(this.onViewStateChange);
    this.fetchViewData(this.props.params);
  },

  componentWillReceiveProps(nextProps) {
    this.fetchViewData(nextProps.params);
  },

  componentDidUpdate() {
    //if population theme selection is hidden but it is the currently selected theme,
    // then update the theme choice to 'needs'
    if (this.state.hidePopulation && this.state.viewChoice.selectedTheme === 'population') {
      DataViewChoiceActions.updateThemeChoice('needs');
    }
  },

  componentWillUnmount() {
    UsageTypeDataStore.unlisten(this.onViewDataChange);
    DataViewChoiceStore.unlisten(this.onDataViewChoiceChange);
    ViewStateStore.unlisten(this.onViewStateChange);
  },

  onViewDataChange(state) {
    this.setState({viewData: state.data});
  },

  onViewStateChange(storeState) {
    this.setState({hidePopulation: this.shouldHidePopulation(storeState.viewState)});
  },

  onDataViewChoiceChange(state) {
    this.setState({viewChoice: state});
  },

  fetchViewData(params) {
    UsageTypeDataStore.fetch({typeId: params.typeId});
  },

  scrollToMainContent(e) {
    e.stopPropagation();
    e.preventDefault();
    this.refs['main-content'].scrollIntoView();
  },

  shouldHidePopulation(viewState) {
    return viewState && viewState.id !== 'municipal';
  },

  render() {
    const viewData = this.state.viewData;
    const usageType = this.props.params.typeId;

    const title = titleize(usageType) + ' Usage';
    const viewName = usageType.toUpperCase();

    return (
      <div className="usage-type-view">
        <Helmet title={title} />
        <a onClick={this.scrollToMainContent} className="skip-link" href="#main-content" tabIndex="1" title="Skip to main content">Skip to Main Content</a>
        <section id="main-content" ref="main-content">
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

                      <div className="row panel-row">
                        <div className="twelve columns">
                          <span className="view-name">{viewName}</span>
                          <PlacePivotTable viewData={viewData}
                            decade={this.state.viewChoice.selectedDecade}
                            theme={this.state.viewChoice.selectedTheme} />
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

});