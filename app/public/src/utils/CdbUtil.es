
import R from 'ramda';
import extend from 'extend';
import axios from 'axios';
import condenseWhitespace from 'condense-whitespace';

const countyTable = 'county_extended';
const regionTable = 'rwpas';

function getLayer(opts) {
  const mapConfig = {
    version: "1.0.1",
    layers: [{
      type: 'cartodb',
      options: extend({cartocss_version: "2.1.1"}, opts)
    }]
  };

  return axios.post('http://tnris.cartodb.com/api/v1/map/', mapConfig)
    .then(({data}) => {
      const layerid = data.layergroupid;
      const tilesUrl = `http://tnris.cartodb.com/api/v1/map/${layerid}/{z}/{x}/{y}.png`;
      if (opts.interactivity) {
        return {
          tilesUrl,
          gridUrl: `http://tnris.cartodb.com/api/v1/map/${layerid}/0/{z}/{x}/{y}.grid.json`
        };
      }
      return {tilesUrl};
    });
}

function createCountiesLayer() {
  return getLayer({
    sql: `SELECT * FROM ${countyTable}`,
    interactivity: ['name'],
    cartocss: condenseWhitespace(`
      Map {
        buffer-size: 128;
      }
      #counties {
        polygon-opacity: 0;
        line-color: #777;
        line-width: 1.5;
        line-opacity: 1;
        ::labels {
          text-name: [name];
          text-face-name: 'Open Sans Regular';
          text-size: 12;
          text-fill: #333;
          text-halo-fill: rgba(255,255,255,0.8);
          text-halo-radius: 2;
          text-allow-overlap: true;
          text-label-position-tolerance: 10;
          [zoom >= 9] {
            text-size: 14;
          }
          [zoom < 8] {
            text-size: 10;
          }
          [zoom < 7] {
            text-name: '';
          }
        }
      }`)
  });
}

function createRegionsLayer() {
  return getLayer({
    sql: `SELECT * FROM ${regionTable}`,
    interactivity: ['letter'],
    cartocss: condenseWhitespace(`
      Map {
        buffer-size: 128;
      }
      #rwpas {
        polygon-opacity: 0.7;
        line-color: #fff;
        line-width: 1;
        line-opacity: 1;
        ::labels {
          text-name: 'Region ' +  [letter];
          text-face-name: 'Open Sans Regular';
          text-size: 14;
          text-fill: #000;
          text-halo-fill: rgba(255,255,255,0.8);
          text-halo-radius: 2;
          text-allow-overlap: true;
          text-label-position-tolerance: 10;
          [zoom < 6] {
            text-size: 9;
            text-halo-radius: 1;
          }
        }
        [letter="A"] {
          polygon-fill: rgb(255,249,174);
        }
        [letter="B"] {
          polygon-fill: rgb(170,215,212);
        }
        [letter="C"] {
          polygon-fill: rgb(222,231,145);
        }
        [letter="D"] {
          polygon-fill: rgb(254,195,78);
        }
        [letter="E"] {
          polygon-fill: rgb(255,228,175);
        }
        [letter="F"] {
          polygon-fill: rgb(193,225,193);
        }
        [letter="G"] {
          polygon-fill: rgb(168,155,195);
        }
        [letter="H"] {
          polygon-fill: rgb(199,223,244);
        }
        [letter="I"] {
          polygon-fill: rgb(126,191,133);
        }
        [letter="J"] {
          polygon-fill: rgb(249,181,171);
        }
        [letter="K"] {
          polygon-fill: rgb(120,182,228);
        }
        [letter="L"] {
          polygon-fill: rgb(255,230,0);
        }
        [letter="M"] {
          polygon-fill: rgb(87,187,182);
        }
        [letter="N"] {
          polygon-fill: rgb(182,189,224);
        }
        [letter="O"] {
          polygon-fill: rgb(194,203,32);
        }
        [letter="P"] {
          polygon-fill: rgb(214,170,203);
        }
      }`)
  });
}

const tolerance = 0.001;

function getCounty(name) {
  const query = `SELECT name, ST_SimplifyPreserveTopology(the_geom, ${tolerance}) as the_geom
    FROM ${countyTable} WHERE name ~* '${name}' LIMIT 1`;
  return axios.get(`https://tnris.cartodb.com/api/v2/sql?format=GeoJSON&q=${query}`)
    .then(({data}) => data);
}

function getRegion(letter) {
  const query = `SELECT letter, ST_SimplifyPreserveTopology(the_geom, ${tolerance}) as the_geom
    FROM ${regionTable} WHERE letter ~* '${letter}' LIMIT 1`;
  return axios.get(`https://tnris.cartodb.com/api/v2/sql?format=GeoJSON&q=${query}`)
    .then(({data}) => data);
}

function getCountyNames() {
  const query = `SELECT distinct(name) as name FROM ${countyTable} ORDER BY name ASC`;
  return axios.get(`https://tnris.cartodb.com/api/v2/sql?q=${query}`)
    .then(({data}) => R.pluck('name', data.rows));
}

function getIntersectingRegions(countyName) {
  // Finds the Regions that intersect the county with the given name
  // To do this, a small (0.1 degrees = ~1km) negative buffer is used on
  // the region geometry to prevent getting intersections that happen at the county borders
  const query = `SELECT ${regionTable}.letter FROM ${regionTable}, ${countyTable}
    WHERE ${countyTable}.name ~* '${countyName}'
    AND ST_Intersects(${regionTable}.the_geom, ST_Buffer(${countyTable}.the_geom, -0.1))`;
  return axios.get(`https://tnris.cartodb.com/api/v2/sql?q=${query}`)
    .then(({data}) => R.pluck('letter', data.rows));
}

export default {
  createCountiesLayer,
  createRegionsLayer,
  getCounty,
  getRegion,
  getCountyNames,
  getIntersectingRegions
};