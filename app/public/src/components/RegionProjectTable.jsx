
import R from 'ramda';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import {Table, Tr, Td} from 'reactable';
// import ToggleDisplay from 'react-toggle-display';
import format from 'format-number';

import PropTypes from '../utils/CustomPropTypes';

export default React.createClass({
  propTypes: {
    projectData: PropTypes.ProjectData.isRequired
  },

  mixins: [LinkedStateMixin, PureRenderMixin],

  getInitialState() {
    return {};
  },

  render() {
    const projectData = this.props.projectData;
    const totalCost = R.sum(R.pluck('CapitalCost', projectData));

    return (
      <div className="recommended-projects-container">
        <h4>Recommended Projects</h4>
        <p>
          Total capital cost of recommended projects in this region: <strong>${format()(totalCost)}</strong>.
        </p>
        <input type="text" placeholder="Type to filter table" className="table-filter"
          valueLink={this.linkState('filter')} />
        <div className="table-container">
          <Table className="table-condensed u-full-width projects-table"
            sortable
            itemsPerPage={10}
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
      </div>
    );
  }

});