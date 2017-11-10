
import R from 'ramda';

import {formatCountyName} from './CountyNames';

export function slugify(s) {
  return s.replace(/\s+/g, '-');
}

export function getMapPadding() {
  if (window.matchMedia("(min-width: 750px)").matches) {
    return [500, 0];
  }
  return [0, 0];
}

export function getChartLeftPadding(chartData) {
  const seriesMaxes = chartData.series.map((series) => {
    return R.apply(Math.max, series.data);
  });
  const max = R.apply(Math.max, seriesMaxes);
  const len = max.toString().length;
  if (len >= 8) {
    return 40;
  }
  else if (len === 7) {
    return 35;
  }
  else if (len === 6) {
    return 25;
  }
  else if (len === 5) {
    return 20;
  }
  return 10;
}

export function getViewName(type, typeId) {
  switch (type.toLowerCase()) {
  case 'region':
    return `Region ${typeId.toUpperCase()}`;
  case 'county':
    return `${formatCountyName(typeId)} County`;
  default:
    return '';
  }
}

//Make an object out of keys, with values derived from them
// from https://github.com/ramda/ramda/wiki/Cookbook#make-an-object-out-of-keys-with-values-derived-from-them
export const objFromKeys = R.curry((fn, keys) => {
  return R.zipObj(keys, R.map(fn, keys));
});
