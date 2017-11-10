import R from 'ramda';
import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import Spinner from 'react-spinkit';
import titleize from 'titleize';

import constants from '../../constants';
import WmsTypeDataStore from "../../stores/WmsTypeDataStore.es";
import DataViewChoiceActions from '../../actions/DataViewChoiceActions';
import DataViewChoiceStore from '../../stores/DataViewChoiceStore';
import DataViewChoiceWrap from '../DataViewChoiceWrap';
import ViewStateStore from '../../stores/ViewStateStore';
import WmsTypeSummary from '../WmsTypeSummary';
import ThemeMaps from '../maps/ThemeMaps';
import ProjectTable from '../ProjectTable';

export default class WMSTypeView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            wmsTypeData: WmsTypeDataStore.getState().wmsTypeData,
            viewChoice: DataViewChoiceStore.getState(),
            hidePopulation: this.shouldHidePopulation(ViewStateStore.getState().viewState)
        }
    }

    componentDidMount = () => {
        WmsTypeDataStore.listen(this.onViewDataChange);
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
        DataViewChoiceActions.updateThemeChoice('strategies');
      }
    }

    componentWillUnmount = () => {
      WmsTypeDataStore.unlisten(this.onViewDataChange);
      DataViewChoiceStore.unlisten(this.onDataViewChoiceChange);
      ViewStateStore.unlisten(this.onViewStateChange);
    }

    onViewDataChange = (state) => {
        this.setState({wmsTypeData: state.wmsTypeData});
    }

    onViewStateChange = (storeState) => {
        this.setState({hidePopulation: this.shouldHidePopulation(storeState.viewState)});
    }

    onDataViewChoiceChange = (state) => {
        this.setState({viewChoice: state});
    }

    fetchViewData = (params) => {
        WmsTypeDataStore.fetch({wmsType: params.wmsType});
    }

    shouldHidePopulation = (viewState) => {
        return viewState && viewState.id !== 'municipal';
    }

    render() {
      const wmsTypeData = this.state.wmsTypeData;
      const wmsType = this.props.match.params.wmsType;

      const title = titleize(wmsType);
      const viewName = titleize(wmsType);
      const themeKeys = this.state.hidePopulation ? constants.THEMES
        : R.prepend('population', constants.THEMES);

      return (
        <div className="wms-type-view">
          <Helmet title={title} />
          <section>
            <div className="view-top wms-type-view-top">
              <div className="summary-wrapper container">
                <WmsTypeSummary wmsTypeData={wmsTypeData} wmsType={wmsType} />
              </div>
            </div>

            {
              (() => {
                if (!wmsTypeData || R.isEmpty(R.keys(wmsTypeData))) {
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
                          <ProjectTable type="entity" projectData={wmsTypeData.data.projects} />
                        </div>
                      </div>
                    </div>
                    <DataViewChoiceWrap decade={this.state.viewChoice.selectedDecade}
                      theme={this.state.viewChoice.selectedTheme}
                      hidePopulation={this.state.hidePopulation}>
                      <div className="container">
                          <div className="row panel-row">
                            <div className="twelve columns">
                              <span className="view-name">{title}</span>
                              <ThemeMaps placeData={wmsTypeData} view={'wmsType'}
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
}

WMSTypeView.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            wmsType: PropTypes.string.isRequired
        }).isRequired
    })
}
