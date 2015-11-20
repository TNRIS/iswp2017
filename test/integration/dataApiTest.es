//TODO
import Code from 'code'
import Lab from 'lab';

import server from 'index.es';

const lab = Lab.script();
const themes = ['demands', 'supplies', 'needs'];

function testDataShape(data) {
  //TODO: also include strategies once DB view is done, ref #51
  Code.expect(data).to.include(themes);
  themes.forEach((theme) => {
    Code.expect(data[theme]).to.include(['rows', 'typeTotals', 'decadeTotals']);
    Code.expect(data[theme].rows).to.be.an.array();
    Code.expect(data[theme].rows.length).to.be.greaterThan(0);
  });
}

lab.test('data - all', (done) => {
  server.inject('/api/v1/data', (res) => {
    Code.expect(res.statusCode).to.equal(200);
    Code.expect(res.result).to.be.an.object();
    testDataShape(res.result);
    done();
  });
});

lab.test('data - state', (done) => {
  server.inject('/api/v1/data/statewide', (res) => {
    Code.expect(res.statusCode).to.equal(200);
    Code.expect(res.result).to.be.an.object();

    Code.expect(res.result).to.include(themes);
    themes.forEach((theme) => {
      Code.expect(res.result[theme]).to.include(['rows', 'typeTotals', 'decadeTotals']);
      Code.expect(res.result[theme].rows).to.be.an.array();
      //statewide data does not include rows because that would be too many
      Code.expect(res.result[theme].rows.length).to.equal(0);
    });

    done();
  });
});

lab.test('data - region', (done) => {
  server.inject('/api/v1/data/region/K', (res) => {
    Code.expect(res.statusCode).to.equal(200);
    Code.expect(res.result).to.be.an.object();
    testDataShape(res.result);
    done();
  });
});

lab.test('data - county', (done) => {
  server.inject('/api/v1/data/county/Aransas', (res) => {
    Code.expect(res.statusCode).to.equal(200);
    Code.expect(res.result).to.be.an.object();
    testDataShape(res.result);
    done();
  });
});

lab.test('data - entity', (done) => {
  server.inject('/api/v1/data/entity/7', (res) => {
    Code.expect(res.statusCode).to.equal(200);
    Code.expect(res.result).to.be.an.object();
    testDataShape(res.result);
    done();
  });
});

export default {lab};
