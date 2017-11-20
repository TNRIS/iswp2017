import PropTypes from 'prop-types';
import R from 'ramda';
import React from 'react';
import {Table, Tr, Td} from 'reactable';
import ToggleDisplay from 'react-toggle-display';
import format from 'format-number';
import history from '../history';

import CustomPropTypes from '../utils/CustomPropTypes';

const itemsPerPage = 10;

export default class ProjectTable extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            filter: ''
        };
    }

    handleTableFilterChange = (evt) => {
        this.setState({filter: evt.target.value});
    }

    render() {
        let projectData = this.props.projectData;
        if (this.props.type === 'region') {
            const groupedById = R.groupBy(R.prop('WmsProjectId'))(this.props.projectData);
            projectData = R.map((group) => {
                const prj = R.nth(0, group);
                return prj;
            })(R.values(groupedById));
        }
        const totalCost = R.sum(R.pluck('CapitalCost', projectData));
        const perPage = projectData.length <= itemsPerPage
            ? 0
            : itemsPerPage;

        let title;
        switch (this.props.type.toLowerCase()) {
            case 'source':
                title = 'Recommended Projects Associated with Source';
                break;
            case 'region':
                title = 'Recommended Projects';
                break;
            case 'wms':
                title = 'Recommended Projects related to Water Management Strategy';
                break;
            case 'wmstype':
                title = 'Recommended Projects related to Water Management Strategy Type'
                break;
            case 'project':
                title = 'Recommended Water Management Strategies related to Project'
                break;
            default:
                title = 'Recommended Projects Serving Area of Interest';
        }

        projectData.map((d) => {
              const id = d.WmsProjectId;
              d["linkRef"] = function() {
                  history.push({pathname: `/project/${id}`})
            };
        });

        const projTable = () => {
            if (this.props.type === 'wms') {
                return (projectData.map((d) => {
                    return (<Tr key={d.WmsId}>
                        <Td column="Project" value={d.ProjectName}>
                            <a className="pointerHover" onClick={d.linkRef}>{d.ProjectName}</a>
                        </Td>
                        <Td column="Decade Online" value={d.OnlineDecade}>
                            {d.OnlineDecade}
                        </Td>
                        <Td column="Sponsor" value={d.ProjectSponsors}>
                            {d.ProjectSponsors}
                        </Td>
                        <Td column="Capital Cost" value={d.CapitalCost}>
                            {`${format({prefix: '$'})(d.CapitalCost)}`}
                        </Td>
                    </Tr>);
                }));
            } else if (this.props.type === 'project') {
                return (projectData.map((d) => {
                    return (<Tr key={d.WmsId}>
                        <Td column="Strategy" value={d.WmsName}>
                            <a className="pointerHover" onClick={() => {history.push({pathname: `/wms/${d.WmsId}`})}}>{d.WmsName}</a>
                        </Td>
                        <Td column="WMS Sponsor Region" value={d.WmsProjectSponsorRegion}>
                            <a className="pointerHover" onClick={() => {history.push({pathname: `/region/${d.WmsSponsorRegion.trim()}`})}}>{d.WmsProjectSponsorRegion}</a>
                        </Td>
                    </Tr>);
                }));
            } else {
                return (projectData.map((d) => {
                    return (<Tr key={d.WmsProjectId}>
                        <Td column="Project" value={d.ProjectName}>
                            <a className="pointerHover" onClick={d.linkRef}>{d.ProjectName}</a>
                        </Td>
                        <Td column="Decade Online" value={d.OnlineDecade}>
                            {d.OnlineDecade}
                        </Td>
                        <Td column="Sponsor" value={d.ProjectSponsors}>
                            {d.ProjectSponsors}
                        </Td>
                        <Td column="Capital Cost" value={d.CapitalCost}>
                            {`${format({prefix: '$'})(d.CapitalCost)}`}
                        </Td>
                    </Tr>);
                }))
            }
        }

        return (<div className="recommended-projects-container">
            <h4>{title}</h4>
            <ToggleDisplay show={projectData.length === 0}>
                <p>There are no recommended projects.</p>
            </ToggleDisplay>
            <ToggleDisplay show={projectData.length > 0 && this.props.type !== 'project'}>
                <p>
                    Total capital cost of recommended projects:{" "}
                    <strong>${format()(totalCost)}</strong>.
                </p>
                <ToggleDisplay show={projectData.length > itemsPerPage}>
                    <input type="text" placeholder="Type to filter table" className="table-filter" value={this.state.filter} onChange={this.handleTableFilterChange}/>
                </ToggleDisplay>
                <div className="table-container">
                    <Table className="table-condensed u-full-width projects-table" sortable={true} itemsPerPage={perPage} pageButtonLimit={5} filterable={['Project', 'Decade Online', 'Sponsor']} hideFilterInput="hideFilterInput" filterBy={this.state.filter} defaultSort={{
                            column: 'Project',
                            direction: 'asc'
                        }}>
                        {projTable()}
                    </Table>
                </div>
            </ToggleDisplay>
            <ToggleDisplay show={projectData.length > 0 && this.props.type === 'project'}>
                <ToggleDisplay show={projectData.length > itemsPerPage}>
                    <input type="text" placeholder="Type to filter table" className="table-filter" value={this.state.filter} onChange={this.handleTableFilterChange}/>
                </ToggleDisplay>
                <div className="table-container">
                    <Table className="table-condensed u-full-width projects-table" sortable={true} itemsPerPage={perPage} pageButtonLimit={5} filterable={['Strategy']} hideFilterInput="hideFilterInput" filterBy={this.state.filter} defaultSort={{
                            column: 'Strategy',
                            direction: 'asc'
                        }}>
                        {projTable()}
                    </Table>
                </div>
                <p className="note">Only strategy names that have strategy supplies assigned to a Water User Group are linked to a water management strategy page.</p>
            </ToggleDisplay>
        </div>);
    }
}

ProjectTable.propTypes = {
    projectData: CustomPropTypes.ProjectData.isRequired,
    type: PropTypes.oneOf(['region', 'county', 'entity', 'source', 'wms', 'wmstype', 'project']).isRequired
}
