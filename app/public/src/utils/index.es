
import R from 'ramda';

function slugify(s) {
  return s.replace(/\s+/g, '-');
}

function getMapPadding() {
  if (window.matchMedia("(min-width: 750px)").matches) {
    return [500, 0];
  }
  return [0, 0];
}

function getChartLeftPadding(chartData) {
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

function getViewName(type, typeId) {
  let typeAndId = typeId;

  if (type === 'region') {
    typeAndId = `Region ${typeId}`;
  }
  else if (type === 'county') {
    typeAndId += ' County';
  }

  typeAndId = typeAndId.toUpperCase();
  return typeAndId;
}

function stringContains(str, search, insensitive = true) {
  if (insensitive) {
    return str.toLowerCase().indexOf(search.toLowerCase()) > -1;
  }
  //else
  return str.indexOf(search) > -1;
}

export default {
  slugify,
  getMapPadding,
  getChartLeftPadding,
  getViewName,
  stringContains
};