import R from 'ramda';
import React from 'react';
import {Table, Tr, Td} from 'reactable';
import ToggleDisplay from 'react-toggle-display';
import format from 'format-number';

import constants from '../constants';
import CustomPropTypes from '../utils/CustomPropTypes';
import Units from './Units';
import {objFromKeys} from '../utils';

export default class EntityStrategiesTable extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const viewData = this.props.viewData;

    if (!viewData) {
      return (
        <div />
      );
    }

    //Strategies are not unique by name, so group by name and then
    // show the decadal sums in the table
    const groupedByName = R.groupBy(R.prop('WmsName'), viewData.strategies.rows);
    const wmsNames = R.keys(groupedByName);
    const decades = constants.DECADES;
    const hasStrategies = viewData.strategies.rows.length > 0;
    return (
      <div className="entity-strategies-container">
        <h4>
          Water Management Strategies
          <Units />
        </h4>
        <ToggleDisplay hide={hasStrategies}>
          <p>There are no water management strategies.</p>
        </ToggleDisplay>
        <ToggleDisplay show={hasStrategies}>
          <div className="table-container">
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
                  const sums = objFromKeys((decade) => {
                    return R.sum(R.pluck(`Value_${decade}`, rows));
                  }, decades);

                  return (
                    <Tr key={wmsName}>
                      <Td column="Strategy" value={wmsName}>
                        <a href={'/wms/' + rows[0].WmsId}>{wmsName}</a>
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
        </ToggleDisplay>
      </div>
    );
  }
}

EntityStrategiesTable.propTypes = {
  viewData: CustomPropTypes.ViewData
}
