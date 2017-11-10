import R from 'ramda';
import React from 'react';
import Spinner from 'react-spinkit';


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

        const regionLink = '/region/' + props.wmsData.wms.WmsSponsorRegion.toUpperCase()

        return (<div className="view-summary usage-type-summary">
            <h2>
                {props.wmsData.wms.WmsName.toUpperCase()}
            </h2>
            <a href={regionLink}>Water Management Strategy Sponsor Region {props.wmsData.wms.WmsSponsorRegion.toUpperCase()}</a>
        </div>);
    }
}
