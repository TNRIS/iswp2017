/*global L*/

import extend from 'extend';
import axios from 'axios';

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
    sql: "SELECT * FROM county_extended",
    cartocss: `
      #county_extended {
        polygon-opacity: 0;
        line-color: #777;
        line-width: 1.5;
        line-opacity: 1;
      }`
  });
}

function createRegionsLayer() {
  return getLayer({
    sql: "SELECT * FROM rwpas",
    interactivity: ['letter'],
    cartocss: `
      Map {
        buffer-size:128;
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
      }`
  });
}

export default {
  createCountiesLayer,
  createRegionsLayer
};