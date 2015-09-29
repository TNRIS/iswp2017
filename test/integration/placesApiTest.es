import Code from 'code';
import Lab from 'lab';

import server from 'index.es';

function expectTopoJson(res) {
  Code.expect(res.result).to.include(['type', 'objects', 'arcs', 'transform']);
  Code.expect(res.result.type).to.equal('Topology');
}

function expectFeatureCollection(res) {
  Code.expect(res.result).to.include(['type', 'features']);
  Code.expect(res.result.type).to.equal('FeatureCollection');
}

function expectFeature(res) {
  Code.expect(res.result).to.include(['type', 'geometry', 'properties']);
  Code.expect(res.result.type).to.equal('Feature');
}

const lab = Lab.script();

lab.test('get region names', (done) => {
  server.inject('/api/v1/places/regions/names', (res) => {
    Code.expect(res.statusCode).to.equal(200);
    Code.expect(res.result).to.be.an.array();
    Code.expect(res.result.length).to.equal(16);
    done();
  });
});

lab.test('get regions geojson', (done) => {
  server.inject('/api/v1/places/regions', (res) => {
    Code.expect(res.statusCode).to.equal(200);
    Code.expect(res.result).to.be.an.object();
    expectFeatureCollection(res);
    Code.expect(res.result.features.length).to.equal(16);
    done();
  });
});

lab.test('get regions topojson', (done) => {
  server.inject('/api/v1/places/regions?f=topojson', (res) => {
    Code.expect(res.statusCode).to.equal(200);
    Code.expect(res.result).to.be.an.object();
    expectTopoJson(res);
    Code.expect(res.result.objects.collection.geometries.length).to.equal(16);
    done();
  });
});

lab.test('get single region', (done) => {
  server.inject('/api/v1/places/regions/L', (res) => {
    Code.expect(res.statusCode).to.equal(200);
    Code.expect(res.result).to.be.an.object();
    // expectFeature(res);
    done();
  });
});

lab.test('get another single region', (done) => {
  server.inject('/api/v1/places/regions/a', (res) => {
    Code.expect(res.statusCode).to.equal(200);
    Code.expect(res.result).to.be.an.object();
    // expectFeature(res);
    done();
  });
});

lab.test('get county names', (done) => {
  server.inject('/api/v1/places/counties/names', (res) => {
    Code.expect(res.statusCode).to.equal(200);
    Code.expect(res.result).to.be.an.array();
    Code.expect(res.result.length).to.equal(254);
    done();
  });
});

lab.test('get counties geojson', (done) => {
  server.inject('/api/v1/places/counties', (res) => {
    Code.expect(res.statusCode).to.equal(200);
    Code.expect(res.result).to.be.an.object();
    expectFeatureCollection(res);
    Code.expect(res.result.features.length).to.equal(254);
    done();
  });
});

lab.test('get counties topojson', (done) => {
  server.inject('/api/v1/places/counties?f=topojson', (res) => {
    Code.expect(res.statusCode).to.equal(200);
    Code.expect(res.result).to.be.an.object();
    expectTopoJson(res);
    Code.expect(res.result.objects.collection.geometries.length).to.equal(254);
    done();
  });
});

lab.test('get single region', (done) => {
  server.inject('/api/v1/places/counties/Bexar', (res) => {
    Code.expect(res.statusCode).to.equal(200);
    Code.expect(res.result).to.be.an.object();
    expectFeature(res);
    done();
  });
});

export default {lab};