
import R from 'ramda';
import React from 'react';
import Helmet from 'react-helmet';
import Spinner from 'react-spinkit';
import titleize from 'titleize';

import UsageTypeDataStore from '../../stores/UsageTypeDataStore';
import DataViewChoiceStore from '../../stores/DataViewChoiceStore';
import UsageTypeSummary from '../UsageTypeSummary';
import ThemeTotalsByDecadeChart from '../charts/ThemeTotalsByDecadeChart';
import ThemeTypesByDecadeChart from '../charts/ThemeTypesByDecadeChart';
import DataByTypeCharts from '../charts/DataByTypeCharts';
import ThemeMaps from '../maps/ThemeMaps';
import PlacePivotTable from '../PlacePivotTable';
import DataViewChoiceWrap from '../DataViewChoiceWrap';

export default React.createClass({
  propTypes: {
    params: React.PropTypes.shape({
      typeId: React.PropTypes.string
    }).isRequired
  },

  getInitialState() {
    return {
      viewData: UsageTypeDataStore.getState().data,
      viewChoice: DataViewChoiceStore.getState()
    };
  },

  componentDidMount() {
    UsageTypeDataStore.listen(this.onViewDataChange);
    DataViewChoiceStore.listen(this.onDataViewChoiceChange);

    this.fetchViewData(this.props.params);
  },

  componentWillReceiveProps(nextProps) {
    this.fetchViewData(nextProps.params);
  },

  componentWillUnmount() {
    UsageTypeDataStore.unlisten(this.onViewDataChange);
    DataViewChoiceStore.unlisten(this.onDataViewChoiceChange);
  },

  onViewDataChange(state) {
    this.setState({viewData: state.data});
  },

  onDataViewChoiceChange(state) {
    this.setState({viewChoice: state});
  },

  fetchViewData(params) {
    UsageTypeDataStore.fetch({typeId: params.typeId});
  },

  render() {
    const viewData = this.state.viewData;
    const usageType = this.props.params.typeId;

    const title = titleize(usageType) + ' Usage';
    const viewName = usageType.toUpperCase();

    return (
      <div className="usage-type-view">
        <Helmet title={title} />
        <section className="main-content">
          <div className="view-top usage-type-view-top">
            <div className="summary-wrapper container">
              <UsageTypeSummary viewData={viewData} usageType={usageType} />
            </div>
            {/* <UsageTypeViewMap viewData={viewData} /> */}
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
                    theme={this.state.viewChoice.selectedTheme}>

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