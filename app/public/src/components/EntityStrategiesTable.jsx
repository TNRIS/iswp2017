
import R from 'ramda';
import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {Table, Tr, Td} from 'reactable';
import format from 'format-number';

import constants from '../constants';
import PropTypes from '../utils/CustomPropTypes';

export default React.createClass({
  propTypes: {
    viewData: PropTypes.ViewData
  },

  mixins: [PureRenderMixin],

  render() {
    const viewData = this.props.viewData;

    if (!viewData) {
      return (
        <div />
      );
    }

    //Strategies are not unique by name, so group by name and then
    // show the decadal sums in the table
    const groupedByName = R.groupBy(R.prop('WMSName'), viewData.strategies.rows);
    const wmsNames = R.keys(groupedByName);
    const decades = constants.DECADES;

    return (
      <div className="entity-strategies-container">
        <h4>
          Water Management Strategies
          <span className="units">(acre-feet/year)</span>
        </h4>
        <div className="entity-strategies-table-container">
          <Table className="table-condensed u-full-width entity-strategies-table"
            sortable
            columns={R.prepend('Strategy', decades)}
            defaultSort={{column: 'Strategy', direction: 'asc'}}>
            {
              //Reactable has some bugs with column order not being preserved,
              // but a workaround is to specify the columns property on the Table elemtn
              // as above
              wmsNames.map((wmsName) => {
                const rows = groupedByName[wmsName];
                const sums = {};
                decades.forEach((decade) => {
                  sums[decade] = R.sum(R.pluck(`Value_${decade}`, rows));
                });

                return (
                  <Tr key={wmsName}>
                    <Td column="Strategy" value={wmsName}>
                      {wmsName}
                    </Td>
                    {
                      decades.map((decade) => {
                        return (
                          <Td key={decade} column={`${decade}`} value={sums[decade]}>{format()(sums[decade])}</Td>
                        );
                      })
                    }
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
