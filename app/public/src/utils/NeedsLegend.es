/*global L:false*/

import R from 'ramda';

import {NEEDS_LEGEND_CLASSES} from '../constants';

function getColorForValue(npdValue) {
  const legendClass = R.find(
    (c) => c.limit >= npdValue,
    NEEDS_LEGEND_CLASSES
  );
  return legendClass.color;
}

function create() {
  const legend = L.control({
    position: 'bottomleft'
  });

  function circleTpl({color}) {
    return `<svg height="8" width="8">
      <circle cx="4" cy="4" r="4" stroke="black" stroke-width="1" fill="${color}">
    </svg>`;
  }

  function tpl({lowerBound, color}) {
    return `${circleTpl({color})} Greater than ${lowerBound}%`;
  }

  legend.onAdd = function onAdd() {
    this._div = L.DomUtil.create('div', 'leaflet-legend legend-needs');
    this._update();
    this.isAdded = true;
    return this._div;
  };

  legend.onRemove = function onRemove() {
    this.isAdded = false;
  };

  legend._update = function _update() {
    L.DomUtil.create('h4', '', this._div)
      .innerHTML = 'Potential shortage<br>(as share of total demand)';

    const ul = L.DomUtil.create('ul', '', this._div);

    for (let i = NEEDS_LEGEND_CLASSES.length - 1; i >= 0; i--) {
      const colorEntry = NEEDS_LEGEND_CLASSES[i];
      const prevColorEntry = NEEDS_LEGEND_CLASSES[i - 1];
      const legendEntry = L.DomUtil.create('li', 'legend-entry', ul);

      if (colorEntry.limit === NEEDS_LEGEND_CLASSES[0].limit) {
        legendEntry.innerHTML = `${circleTpl({color: colorEntry.color})} Less than 10%`;
      }
      else {
        legendEntry.innerHTML = tpl({
          color: colorEntry.color,
          lowerBound: prevColorEntry ? prevColorEntry.limit : 0
        });
      }
    }
  };

  return legend;
}

export default {
  create,
  getColorForValue
};