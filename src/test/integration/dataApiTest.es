
import Code from 'code';
import Lab from 'lab';

import server from 'index.es';

const lab = Lab.script();

const themes = ['demands', 'supplies', 'needs', 'strategies', 'population'];
const decades = ['2020', '2030', '2040', '2050', '2060', '2070'];

function testTotalsByFieldShape(totals) {
  Object.keys(totals).forEach((key) => {
    Code.expect(totals[key]).to.include(decades);
  });
}

function testDataShape(data, omitRows = false) {
  Code.expect(data).to.include(themes);
  themes.forEach((theme) => {
    Code.expect(data[theme]).to.include(['rows', 'typeTotals', 'decadeTotals']);

    testTotalsByFieldShape(data[theme].typeTotals);
    Code.expect(data[theme].decadeTotals).to.include(decades);

    if (theme === 'strategies') {
      Code.expect(data[theme]).to.include(['strategySourceTotals', 'strategyTypeTotals']);
      testTotalsByFieldShape(data[theme].strategySourceTotals);
      testTotalsByFieldShape(data[theme].strategyTypeTotals);
    }

    Code.expect(data[theme].rows).to.be.an.array();
    if (omitRows) {
      Code.expect(data[theme].rows.length).to.equal(0);
    }
    else {
      Code.expect(data[theme].rows.length).to.be.greaterThan(0);
      const datum = data[theme].rows[0];
      Code.expect(datum).to.include([
        "Value_2020", "Value_2030", "Value_2040", "Value_2050",
        "Value_2060", "Value_2070", "EntityId", "EntityName",
        "WugType", "WugRegion", "WugCounty", "Latitude", "Longitude",
        "EntityTypeName", "EntityIsSplit"
      ]);

      if (theme === 'needs') {
        Code.expect(datum).to.include([
          'NPD2020', 'NPD2030', 'NPD2040', 'NPD2050', 'NPD2060', 'NPD2070'
        ]);
      }

      if (theme === 'strategies') {
        Code.expect(datum).to.include([
          'WmsName', 'WmsType', 'SourceName', 'SourceType', 'MapSourceId'
        ]);
      }
    }
  });
}

function testProjects(data) {
  Code.expect(data).to.include('projects');
  Code.expect(data.projects).to.be.an.array();
  Code.expect(data.projects[0]).to.include([
    "CapitalCost", "OnlineDecade", "ProjectName", "ProjectSponsors",
    "WMSProjectId", "WMSProjectSponsorRegion"
  ]);
}

lab.experiment('data api', () => {
  lab.before((done) => {
    //wait until plugins are registered
    //it would be better if the server notified when plugins were registered, but
    //  that functionality doesn't seem to exist
    setTimeout(done, 500);
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
      testProjects(res.result);
      done();
    });
  });

  lab.test('data - county', (done) => {
    server.inject('/api/v1/data/county/Travis', (res) => {
      Code.expect(res.statusCode).to.equal(200);
      Code.expect(res.result).to.be.an.object();
      testDataShape(res.result);
      testProjects(res.result);
      done();
    });
  });

  lab.test('data - entity', (done) => {
    server.inject('/api/v1/data/entity/7', (res) => {
      Code.expect(res.statusCode).to.equal(200);
      Code.expect(res.result).to.be.an.object();
      testDataShape(res.result);
      testProjects(res.result);
      done();
    });
  });

  lab.test('data - usagetype', (done) => {
    server.inject('/api/v1/data/usagetype/mining', (res) => {
      Code.expect(res.statusCode).to.equal(200);
      Code.expect(res.result).to.be.an.object();
      testDataShape(res.result);
      // -- No projects for usagetype
      done();
    });
  });
});

export default {lab};