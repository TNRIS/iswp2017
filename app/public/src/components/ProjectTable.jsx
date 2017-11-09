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
            const groupedById = R.groupBy(R.prop('WMSProjectId'))(this.props.projectData);
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
            default:
                title = 'Recommended Projects Serving Area of Interest';
        }

        projectData.map((d) => {
            const id = d.WMSProjectId;
            d["linkRef"] = function() {
                history.push({pathname: `/project/${id}`})
            };
        });

        const projTable = () => {
            if (this.props.type === 'wms') {
                return (projectData.map((d) => {
                    return (<Tr key={d.WMSId}>
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
            } else {
                return (projectData.map((d) => {
                    return (<Tr key={d.WMSProjectId}>
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
            <ToggleDisplay show={projectData.length > 0}>
                <p>
                    Total capital cost of recommended projects:
                    <strong>${format()(totalCost)}</strong>.
                </p>
                <ToggleDisplay show={projectData.length > itemsPerPage}>
                    <input type="text" placeholder="Type to filter table" className="table-filter" value={this.state.filter} onChange={this.handleTableFilterChange}/>
                </ToggleDisplay>
                <div className="table-container">
                    <Table className="table-condensed u-full-width projects-table" sortable="sortable" itemsPerPage={perPage} pageButtonLimit={5} filterable={['Project', 'Decade Online', 'Sponsor']} hideFilterInput="hideFilterInput" filterBy={this.state.filter} defaultSort={{
                            column: 'Project',
                            direction: 'asc'
                        }}>
                        {projTable()}
                    </Table>
                </div>
            </ToggleDisplay>
        </div>);
    }
}

ProjectTable.propTypes = {
    projectData: CustomPropTypes.ProjectData.isRequired,
    type: PropTypes.oneOf(['region', 'county', 'entity', 'source', 'wms']).isRequired
}
