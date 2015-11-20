
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
          polygon-fill: rgb(132,109,171);
        }
        [letter="B"] {
          polygon-fill: rgb(132,109,171);
        }
        [letter="C"] {
          polygon-fill: rgb(131,149,203);
        }
        [letter="D"] {
          polygon-fill: rgb(132,109,171);
        }
        [letter="E"] {
          polygon-fill: rgb(132,109,171);
        }
        [letter="F"] {
          polygon-fill: rgb(132,109,171);
        }
        [letter="G"] {
          polygon-fill: rgb(148,170,36);
        }
        [letter="H"] {
          polygon-fill: rgb(189,111,167);
        }
        [letter="I"] {
          polygon-fill: rgb(132,109,171);
        }
        [letter="J"] {
          polygon-fill: rgb(132,109,171);
        }
        [letter="K"] {
          polygon-fill: rgb(219,77,117);
        }
        [letter="L"] {
          polygon-fill: rgb(244,122,100);
        }
        [letter="M"] {
          polygon-fill: rgb(254,195,78);
        }
        [letter="N"] {
          polygon-fill: rgb(132,109,171);
        }
        [letter="O"] {
          polygon-fill: rgb(132,109,171);
        }
        [letter="P"] {
          polygon-fill: rgb(132,109,171);
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