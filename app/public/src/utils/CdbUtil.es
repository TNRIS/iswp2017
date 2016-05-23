
import extend from 'extend';
import axios from 'axios';
import condenseWhitespace from 'condense-whitespace';

const countyTable = 'county_extended';
const regionTable = 'regional_water_planning_areas';

function getLayer(opts) {
  const mapConfig = {
    version: "1.0.1",
    layers: [{
      type: 'cartodb',
      options: extend({cartocss_version: "2.1.1"}, opts)
    }]
  };

  return axios.post('https://tnris.cartodb.com/api/v1/map/', mapConfig)
    .then(({data}) => {
      const layerid = data.layergroupid;
      const tilesUrl = `https://tnris.cartodb.com/api/v1/map/${layerid}/{z}/{x}/{y}.png`;
      if (opts.interactivity) {
        return {
          tilesUrl,
          gridUrl: `https://tnris.cartodb.com/api/v1/map/${layerid}/0/{z}/{x}/{y}.grid.json`
        };
      }
      return {tilesUrl};
    });
}

function createEntityLayer(entity) {
  return getLayer({
    sql: condenseWhitespace(`
      SELECT
        ST_Transform(ST_SetSRID(ST_MakePoint(${entity.Longitude}, ${entity.Latitude}),4326),3857) as the_geom_webmercator,
        '${entity.EntityName}' as name
      FROM ${countyTable} LIMIT 1
    `),
    cartocss: condenseWhitespace(`
      Map {
        buffer-size: 128;
      }
      #layer {
        marker-width: 14;
        marker-fill: #3F556D;
        marker-line-color: #FFF;
        marker-line-width: 2;
        [zoom < 8] {
          marker-width: 10;
        }
        ::labels {
          text-name: [name];
          text-wrap-width: 20;
          text-face-name: 'Lato Bold';
          text-placement: point;
          text-placement-type: simple;
          text-dx: 0;
          text-dy: -10;
          text-size: 14;
          text-fill: #3F556D;
          text-halo-fill: #FFF;
          text-halo-radius: 2;
          [zoom < 7] {
            text-name: '';
          }
        }
      }
    `)
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
          text-fill: #888;
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
            text-size: 11;
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
    FROM ${countyTable} WHERE LOWER(name) = LOWER('${name}') LIMIT 1`;
  return axios.get(`https://tnris.cartodb.com/api/v2/sql?format=GeoJSON&q=${query}`)
    .then(({data}) => data);
}

function getRegion(letter) {
  const query = `SELECT letter, ST_SimplifyPreserveTopology(the_geom, ${tolerance}) as the_geom
    FROM ${regionTable} WHERE UPPER(letter) = UPPER('${letter}') LIMIT 1`;
  return axios.get(`https://tnris.cartodb.com/api/v2/sql?format=GeoJSON&q=${query}`)
    .then(({data}) => data);
}

export default {
  createEntityLayer,
  createCountiesLayer,
  createRegionsLayer,
  getCounty,
  getRegion
};
