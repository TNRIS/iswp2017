
import R from 'ramda';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import LinkedStateMixin from 'react-addons-linked-state-mixin';
import {Table, Tr, Td} from 'reactable';
import ToggleDisplay from 'react-toggle-display';
import format from 'format-number';
import history from '../history';

import PropTypes from '../utils/CustomPropTypes';

const itemsPerPage = 10;

export default React.createClass({
  propTypes: {
    projectData: PropTypes.ProjectData.isRequired,
    type: React.PropTypes.oneOf(['region', 'county', 'entity', 'source']).isRequired
  },

  mixins: [LinkedStateMixin, PureRenderMixin],

  getInitialState() {
    return {};
  },

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
    const perPage = projectData.length <= itemsPerPage ? 0 : itemsPerPage;

    let title;
    switch (this.props.type.toLowerCase()) {
      case 'source': 
        title = 'Recommended Projects Associated with Source';
        break;
      case 'region':
        title = 'Recommended Projects';
        break;
      default: title = 'Recommended Projects Serving Area of Interest';
    };

    projectData.map((d) => {
      const id = d.WMSProjectId;
      d["linkRef"] = function () {history.push({pathname: `/project/${id}`})};
    });

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
                        <a className="pointerHover" onClick={d.linkRef}>{d.ProjectName}</a>
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