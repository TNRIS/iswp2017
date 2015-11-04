/*global L*/
/*global cartodb*/

function createCountiesLayer() {
  return new Promise((resolve, reject) => {
    cartodb.Tiles.getTiles({
      user_name: "tnris",
      sublayers: [{
        sql: "SELECT * FROM county_extended",
        cartocss: `
          #county_extended {
            polygon-opacity: 0;
            line-color: #777;
            line-width: 1.5;
            line-opacity: 1;
          }`
      }]
    }, (layerDefinitions, err) => {
      if (!layerDefinitions || !layerDefinitions.tiles[0]) {
        reject(err);
      }
      else {
        resolve(L.tileLayer(layerDefinitions.tiles[0]));
      }
    });
  });
}

export default {
  createCountiesLayer
};