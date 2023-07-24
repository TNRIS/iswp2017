import axios from 'axios';

const countyTable = 'county_extended';
const regionTable = 'rwpas';
const sourceTable = 'iswp_sourcefeatures2017';

function createEntityLayer(entity) {
  const url = `https://mapserver.tnris.org?map=/tnris_mapfiles/vw2017MapEntityCoordinates.map&mode=tile&tilemode=gmap&tile={x}+{y}+{z}&layers=vw2017Entity&map.imagetype=png&EntityName=${entity.EntityName}`;
  const ret = {
    tilesUrl: url
  };
  return ret;
}

function createCountiesLayer() {
  const url = `https://mapserver.tnris.org?map=/tnris_mapfiles/${countyTable}.map&mode=tile&tilemode=gmap&tile={x}+{y}+{z}&layers=CountyBoundaries&map.imagetype=png`;
  const ret = {
    tilesUrl: url,
    gridUrl: url.replace('png', 'utfgrid')
  };
  return ret;
}

function createCountiesLabelsLayer() {
  const url = `https://mapserver.tnris.org?map=/tnris_mapfiles/${countyTable}.map&mode=tile&tilemode=gmap&tile={x}+{y}+{z}&layers=Labels&map.imagetype=png`;
  const ret = {
    tilesUrl: url,
    gridUrl: url.replace('png', 'utfgrid')
  };
  return ret;
}

function createRegionsLayer() {
  const url = `https://mapserver.tnris.org?map=/tnris_mapfiles/${regionTable}.map&mode=tile&tilemode=gmap&tile={x}+{y}+{z}&layers=RWPAS&map.imagetype=png`;
  const ret = {
    tilesUrl: url,
    gridUrl: url.replace('png', 'utfgrid')
  };
  return ret;
}

function createRegionsLabelsLayer() {
  const url = `https://mapserver.tnris.org?map=/tnris_mapfiles/${regionTable}.map&mode=tile&tilemode=gmap&tile={x}+{y}+{z}&layers=Labels&map.imagetype=png`;
  const ret = {
    tilesUrl: url
  };
  return ret;
}

const tolerance = 0.001;

function getCounty(name) {
  return axios.get(`https://mapserver.tnris.org/?map=/tnris_mapfiles/${countyTable}.map&SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature&TYPENAMES=CountyBoundaries&outputformat=geojson&SRSNAME=EPSG:4326&Filter=<Filter><PropertyIsEqualTo><PropertyName>name</PropertyName><Literal>${name}</Literal></PropertyIsEqualTo></Filter>`)
      .then(({data}) => data);
}

function getRegion(letter) {
  return axios.get(`https://mapserver.tnris.org/?map=/tnris_mapfiles/${regionTable}.map&SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature&TYPENAMES=RWPAS&outputformat=geojson&SRSNAME=EPSG:4326&Filter=<Filter><PropertyIsEqualTo><PropertyName>letter</PropertyName><Literal>${letter}</Literal></PropertyIsEqualTo></Filter>`)
      .then(({data}) => data);
}

function getSource(ids) {
  const feat = {
    "type": "FeatureCollection",
    "features": []
  };

  let promises = ids.map((srcId) => {
    return axios.get(`https://mapserver.tnris.org/?map=/tnris_mapfiles/${sourceTable}.map&SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature&TYPENAMES=AllSources&outputformat=geojson&SRSNAME=EPSG:4326&Filter=<Filter><PropertyIsEqualTo><PropertyName>sourceid</PropertyName><Literal>${srcId}</Literal></PropertyIsEqualTo></Filter>`)
      .then(({data}) => {
        if (data.features.length > 0) {
          const featureTyp = data.features[0].properties.featuretyp;
          const layerName = featureTyp.charAt(0).toUpperCase() + featureTyp.slice(1);
          return axios.get(`https://mapserver.tnris.org/?map=/tnris_mapfiles/${sourceTable}.map&SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature&TYPENAMES=${layerName}Sources&outputformat=geojson&SRSNAME=EPSG:4326&Filter=<Filter><PropertyIsEqualTo><PropertyName>sourceid</PropertyName><Literal>${srcId}</Literal></PropertyIsEqualTo></Filter>`)
            .then(({data}) => {
              feat.features = feat.features.concat(data.features);
            });
        }
      });
  });
  return Promise.all(promises).then(() => {return feat;});
}

function apiSources(id) {
  let query = `https://mapserver.tnris.org/?map=/tnris_mapfiles/${sourceTable}.map&SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature&TYPENAMES=AllSources&outputformat=geojson&SRSNAME=EPSG:4326&PROPERTYNAME=sourceid,name,sourcetype,isnew,drawingord,featuretyp`;
  if (id) {
    query += `&Filter=<Filter><PropertyIsEqualTo><PropertyName>sourceid</PropertyName><Literal>${id[0]}</Literal></PropertyIsEqualTo></Filter>`;
  }
  return axios.get(query).then(({data}) => data);
}

function apiNameSources(searchName) {
  let query = `https://mapserver.tnris.org/?map=/tnris_mapfiles/${sourceTable}.map&SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature&TYPENAMES=AllSources&outputformat=geojson&SRSNAME=EPSG:4326&PROPERTYNAME=sourceid,name,sourcetype,isnew,drawingord,featuretyp`;
  query += `&Filter=<Filter><PropertyIsLike wildCard="*" singleChar="." escape="!"><PropertyName>name</PropertyName><Literal>${searchName}</Literal></PropertyIsLike></Filter>`;
  return axios.get(query).then(({data}) => data);
}

function apiGeoJsonSources(id) {
  const feat = {
    "type": "FeatureCollection",
    "features": []
  };
  if (id) {
    let promises = id.map((srcId) => {
      return axios.get(`https://mapserver.tnris.org/?map=/tnris_mapfiles/${sourceTable}.map&SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature&TYPENAMES=AllSources&outputformat=geojson&SRSNAME=EPSG:4326&Filter=<Filter><PropertyIsEqualTo><PropertyName>sourceid</PropertyName><Literal>${srcId}</Literal></PropertyIsEqualTo></Filter>`)
        .then(({data}) => {
          if (data.features.length > 0) {
            const featureTyp = data.features[0].properties.featuretyp;
            const layerName = featureTyp.charAt(0).toUpperCase() + featureTyp.slice(1);
            return axios.get(`https://mapserver.tnris.org/?map=/tnris_mapfiles/${sourceTable}.map&SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature&TYPENAMES=${layerName}Sources&outputformat=geojson&SRSNAME=EPSG:4326&PROPERTYNAME=sourceid,name,sourcetype,isnew,drawingord,featuretyp&Filter=<Filter><PropertyIsEqualTo><PropertyName>sourceid</PropertyName><Literal>${srcId}</Literal></PropertyIsEqualTo></Filter>`)
              .then(({data}) => {
                feat.features = feat.features.concat(data.features);
              });
          }
        });
    });
    return Promise.all(promises).then(() => {return feat;});
  }
  else {  
    let promises = ['PolygonSources','LineSources','PointSources'].map((layerName) => {
      let query = `https://mapserver.tnris.org/?map=/tnris_mapfiles/${sourceTable}.map&SERVICE=WFS&VERSION=2.0.0&REQUEST=GetFeature&TYPENAMES=${layerName}&outputformat=geojson&SRSNAME=EPSG:4326&PROPERTYNAME=sourceid,name,sourcetype,isnew,drawingord,featuretyp`;
      return axios.get(query)
        .then(({data}) => {
          feat.features = feat.features.concat(data.features);
        });
    });
    return Promise.all(promises).then(() => {return feat;});
  }
}

export default {
  createEntityLayer,
  createCountiesLayer,
  createCountiesLabelsLayer,
  createRegionsLayer,
  createRegionsLabelsLayer,
  getCounty,
  getRegion,
  getSource,
  apiSources,
  apiNameSources,
  apiGeoJsonSources
};
