
import R from 'ramda';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {Table, Tr, Td} from 'reactable';
// import ToggleDisplay from 'react-toggle-display';
import format from 'format-number';

import PropTypes from '../utils/CustomPropTypes';

export default React.createClass({
  propTypes: {
    projectData: PropTypes.ProjectData.isRequired
  },

  mixins: [PureRenderMixin],

  render() {
    const projectData = this.props.projectData;
    const totalCost = R.sum(R.pluck('CapitalCost', projectData));

    return (
      <div className="project-list-container">
        <h4>Recommended Projects</h4>
        <p>
          Total capital cost of recommended projects: <strong>${format()(totalCost)}</strong>.
        </p>
        <Table className="table-condensed u-full-width projects-table"
          sortable
          itemsPerPage={10}
          pageButtonLimit={5}
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
    );
  }

});