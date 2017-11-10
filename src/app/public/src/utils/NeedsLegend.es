/*global L:false*/

import constants from '../constants';

export function getColorForValue(npdValue) {
  const legendClass = constants.NEEDS_LEGEND_CLASSES.find(
    (c) => {return c.limit >= npdValue;}
  )
  return legendClass.color;
}

export function create() {
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
    return this._div;
  };

  legend._update = function _update() {
    L.DomUtil.create('h4', '', this._div)
      .innerHTML = 'Potential shortage<br>(as share of total demand)';

    const ul = L.DomUtil.create('ul', '', this._div);

    for (let i = constants.NEEDS_LEGEND_CLASSES.length - 1; i >= 0; i--) {
      const colorEntry = constants.NEEDS_LEGEND_CLASSES[i];
      const prevColorEntry = constants.NEEDS_LEGEND_CLASSES[i - 1];
      const legendEntry = L.DomUtil.create('li', 'legend-entry', ul);

      if (colorEntry.limit === constants.NEEDS_LEGEND_CLASSES[0].limit) {
        legendEntry.innerHTML = `${circleTpl({color: colorEntry.color})} Less than 10%`;
      }
      else {
        legendEntry.innerHTML = tpl({
          color: colorEntry.color,
          lowerBound: prevColorEntry ? prevColorEntry.limit : 0
        });
      }
    }

    L.DomUtil.create('p', '', this._div)
      .innerHTML = '*Zero needs not displayed';
  };

  return legend;
}