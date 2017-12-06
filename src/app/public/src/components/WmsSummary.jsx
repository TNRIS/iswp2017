import R from 'ramda';
import React from 'react';
import Spinner from 'react-spinkit';

import WmsSummarySubhead from './WmsSummarySubhead';


export default class WmsSummary extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        const props = this.props;

        if (!props.wmsData || R.isEmpty(R.keys(props.wmsData))) {
            return (<div className="view-summary">
                <Spinner name="double-bounce" fadeIn='none'/>
            </div>);
        }

        const wmsSponsorRegion = props.wmsData.wms.WmsSponsorRegion.toUpperCase();

        return (<div className="view-summary wms-summary">
            <h2>
                {props.wmsData.wms.WmsName.toUpperCase()}
            </h2>
            <div className="subhead">
              <WmsSummarySubhead wmsSponsorRegion={wmsSponsorRegion} />
            </div>
        </div>);
    }
}
