
import R from 'ramda';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import {Table, Tr, Td} from 'reactable';
import ToggleDisplay from 'react-toggle-display';
import format from 'format-number';

import PropTypes from '../utils/CustomPropTypes';

const itemsPerPage = 10;

export default React.createClass({
  propTypes: {
    projectData: PropTypes.ProjectData.isRequired,
    type: React.PropTypes.oneOf(['region', 'county', 'entity']).isRequired
  },

  mixins: [LinkedStateMixin, PureRenderMixin],

  getInitialState() {
    return {};
  },

  render() {
    const projectData = this.props.projectData;
    const totalCost = R.sum(R.pluck('CapitalCost', projectData));
    const perPage = projectData.length <= itemsPerPage ? 0 : itemsPerPage;

    const title = this.props.type.toLowerCase() === 'region' ?
      'Recommended Projects' : 'Recommended Projects Serving Area of Interest';

    return (
      <div className="recommended-projects-container">
        <h4>{title}</h4>
        <ToggleDisplay show={projectData.length === 0}>
          <p>There are no recommended projects.</p>
        </ToggleDisplay>
        <ToggleDisplay show={projectData.length > 0}>
          <p>
            Total capital cost of recommended projects: <strong>${format()(totalCost)}</strong>.
          </p>
          <ToggleDisplay show={projectData.length > itemsPerPage}>
            <input type="text" placeholder="Type to filter table" className="table-filter"
              valueLink={this.linkState('filter')} />
          </ToggleDisplay>
          <div className="table-container">
            <Table className="table-condensed u-full-width projects-table"
              sortable
              itemsPerPage={perPage}
              pageButtonLimit={5}
              filterable={['Project', 'Decade Online', 'Sponsor']}
              hideFilterInput
              filterBy={this.state.filter}
              defaultSort={{column: 'Project', direction: 'asc'}}>
              {
                projectData.map((d) => {
                  return (
                    <Tr key={d.WMSProjectId}>
                      <Td column="Project" value={d.ProjectName}>
                        {d.ProjectName}
                      </Td>
                      <Td column="Decade Online" value={d.OnlineDecade}>
                        {d.OnlineDecade}
                      </Td>
                      <Td column="Sponsor" value={d.ProjectSponsors}>
                        {d.ProjectSponsors}
                      </Td>
                      <Td column="Capital Cost" value={d.CapitalCost}>
                        {`\$${format()(d.CapitalCost)}`}
                      </Td>
                    </Tr>
                  );
                })
              }
            </Table>
          </div>
        </ToggleDisplay>
      </div>
    );
  }

});