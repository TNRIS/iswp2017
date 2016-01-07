

import Code from 'code';
import Lab from 'lab';

import server from 'index.es';

const lab = Lab.script();

const themes = ['demands', 'supplies', 'needs', /*'strategies',*/ 'population'];
const decades = ['2020', '2030', '2040', '2050', '2060', '2070'];

function testDataShape(data, omitRows = false) {
  //TODO: also include strategies once DB view is done, ref #51
  Code.expect(data).to.include(themes);
  themes.forEach((theme) => {
    Code.expect(data[theme]).to.include(['rows', 'typeTotals', 'decadeTotals']);
    Code.expect(data[theme].rows).to.be.an.array();
    if (omitRows) {
      Code.expect(data[theme].rows.length).to.equal(0);
    }
    else {
      Code.expect(data[theme].rows.length).to.be.greaterThan(0);
    }
  });
}

lab.experiment('data api', () => {
  lab.before((done) => {
    server.on('start', () => {
      console.log('started2');
      done();
    });
  });

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
      testDataShape(res.result);
      done();
    });
  });

  lab.test('data - state with omitRows', (done) => {
    server.inject('/api/v1/data/statewide?omitRows=true', (res) => {
      Code.expect(res.statusCode).to.equal(200);
      Code.expect(res.result).to.be.an.object();
      testDataShape(res.result, true);
      done();
    });
  });

  lab.test('data - regional summary', (done) => {
    server.inject('/api/v1/data/statewide/regionalsummary', (res) => {
      Code.expect(res.statusCode).to.equal(200);
      Code.expect(res.result).to.be.an.object();
      const data = res.result;
      Code.expect(data).to.include(themes);
      themes.forEach((theme) => {
        Code.expect(data[theme]).to.include(decades);
        decades.forEach((decade) => {
          Code.expect(data[theme][decade].length).to.equal(16);
        });
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
});

export default {lab};