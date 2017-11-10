import R from 'ramda';
import React from 'react';
import PropTypes from 'prop-types';
import titleize from 'titleize';
import Spinner from 'react-spinkit';
import Helmet from 'react-helmet';

import WmsDataStore from "../../stores/WmsDataStore.es";
import DataViewChoiceActions from '../../actions/DataViewChoiceActions';
import DataViewChoiceStore from '../../stores/DataViewChoiceStore';
import DataViewChoiceWrap from '../DataViewChoiceWrap';
import ViewStateStore from '../../stores/ViewStateStore';
import WmsSummary from '../WmsSummary';
import ThemeMaps from '../maps/ThemeMaps';
import ProjectTable from '../ProjectTable';
import PlacePivotTable from '../PlacePivotTable';
import constants from '../../constants';
import DownloadDataLink from '../DownloadDataLink';


export default class WMSView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            wmsData: WmsDataStore.getState().wmsData,
            viewChoice: DataViewChoiceStore.getState()
        }
    }

    componentDidMount = () => {
        WmsDataStore.listen(this.onViewDataChange);
        DataViewChoiceStore.listen(this.onDataViewChoiceChange);
        ViewStateStore.listen(this.onViewStateChange);
        this.fetchViewData(this.props.match.params);
    }

    componentWillReceiveProps = (nextProps) => {
        this.fetchViewData(nextProps.match.params);
    }

    componentWillUnmount = () => {
        WmsDataStore.unlisten(this.onViewDataChange);
        DataViewChoiceStore.unlisten(this.onDataViewChoiceChange);
        ViewStateStore.unlisten(this.onViewStateChange);
    }

    onViewDataChange = (state) => {
        this.setState({wmsData: state.wmsData});
    }

    onViewStateChange = (storeState) => {
        this.setState({
            hidePopulation: this.shouldHidePopulation(storeState.viewState)
        });
    }

    onDataViewChoiceChange = (state) => {
        this.setState({viewChoice: state});
    }

    fetchViewData = (params) => {
        WmsDataStore.fetch({wmsId: params.wmsId});
    }

    shouldHidePopulation = (viewState) => {
        return viewState && viewState.id !== 'municipal';
    }

    componentDidUpdate = () => {
        //if population theme selection is hidden but it is the currently selected theme,
        // then update the theme choice to 'needs'
        if (this.state.hidePopulation && this.state.viewChoice.selectedTheme === 'population') {
            DataViewChoiceActions.updateThemeChoice('strategies');
        }
    }

    render() {
        const wmsId = this.props.match.params.wmsId;
        const wmsData = this.state.wmsData;

        let wmsName;
        if (R.hasIn('wms', wmsData)) {
            wmsName = wmsData.wms.WmsName;
        } else {
            wmsName = '';
        }

        const title = wmsName
        const themeKeys = this.state.hidePopulation ? constants.THEMES
          : R.prepend('population', constants.THEMES);

        return (
        <div className="wms-view">
            <Helmet title={title}/>
            <section>
                <div className="view-top usage-type-view-top">
                    <div className="summary-wrapper container">
                        <WmsSummary wmsData={wmsData}/>
                    </div>
                </div>

                {
                    (() => {
                        if (!wmsData || R.isEmpty(R.keys(wmsData))) {
                            return (<div className="container">
                                <div className="row panel-row">
                                    <div className="twelve columns">
                                        <Spinner name="double-bounce" fadeIn='none'/>
                                    </div>
                                </div>
                            </div>);
                        }
                        return (<div>
                            <div className="container">
                                <div className="row panel-row">
                                    <div className="twelve columns">
                                        <span className="view-name">{title}</span>
                                        <ProjectTable type="wms" projectData={wmsData.data.projects}/>
                                    </div>
                                </div>
                            </div>
                            <DataViewChoiceWrap decade={this.state.viewChoice.selectedDecade} hideTheme={true} theme="strategies" hidePopulation={this.state.hidePopulation}>
                                <div className="container">
                                    <div className="row panel-row">
                                        <div className="twelve columns">
                                            <span className="view-name">{title}</span>
                                            <ThemeMaps placeData={wmsData} view={'wms'} decade={this.state.viewChoice.selectedDecade} theme="strategies"/>
                                        </div>
                                    </div>
                                    <div className="row panel-row">
                                      <div className="twelve columns">
                                        <span className="view-name">{wmsName}</span>
                                        <PlacePivotTable viewData={wmsData.data}
                                          decade={this.state.viewChoice.selectedDecade}
                                          theme={this.state.viewChoice.selectedTheme} />
                                        <h5>Download Data</h5>
                                        <ul>
                                          {
                                            ['strategies'].map((theme) => {
                                              if (R.isEmpty(wmsData)) {
                                                return (
                                                  <li key={`download-${theme}`}>
                                                    No {constants.THEME_TITLES[theme]} data exists for {wmsName} Usage Type
                                                  </li>
                                                );
                                              }
                                              return (
                                                <li key={`download-${theme}`}>
                                                  <DownloadDataLink
                                                    type="wms"
                                                    typeId={wmsId}
                                                    theme={theme}
                                                    viewName={wmsName} />
                                                </li>
                                              );
                                            })
                                          }
                                        </ul>
                                      </div>
                                    </div>
                                </div>
                            </DataViewChoiceWrap>
                        </div>);
                    })()
                }
            </section>
        </div>)
    }
}

WMSView.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({wmsId: PropTypes.string.isRequired}).isRequired
    })
}
