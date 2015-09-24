import Code from 'code';
import Lab from 'lab';

import server from 'index.es';

const lab = Lab.script();
const years = ['2020', '2030', '2040', '2050', '2060', '2070'];
const themes = ['needs', 'demands', 'supplies', 'strategies']; //TODO: Population

function testDataResult(res) {
  Code.expect(res.statusCode).to.equal(200);
  Code.expect(res.result).to.be.an.array();
  Code.expect(res.result.length).to.be.greaterThan(0);
}

themes.forEach((theme) => {
  lab.test(`${theme} - all`, (done) => {
    server.inject(`/api/v1/${theme}`, (res) => {
      testDataResult(res);
      const first = res.result[0];
      Code.expect(first).to.include(['EntityId', 'EntityName', 'WugType',
        'WugRegion', 'WugCounty', 'Value_2020', 'Value_2030', 'Value_2040',
        'Value_2050', 'Value_2060', 'Value_2070'
      ]);
      done();
    });
  });

  years.forEach((year) => {
    lab.test(`${theme} - regional summary for ${year}`, (done) => {
      server.inject(`/api/v1/${theme}/${year}/summary/region`, (res) => {
        testDataResult(res);
        const first = res.result[0];
        Code.expect(first).to.include(['WugRegion', 'MUNICIPAL', 'IRRIGATION',
          'MANUFACTURING', 'MINING', 'STEAMELECTRIC', 'LIVESTOCK', 'TOTAL'
        ]);
        done();
      });
    });

    lab.test(`${theme} - all for ${year}`, (done) => {
      server.inject(`/api/v1/${theme}/${year}`, (res) => {
        testDataResult(res);
        const first = res.result[0];
        Code.expect(first).to.include(['EntityId', 'EntityName', 'WugType',
          'WugRegion', 'WugCounty', `Value_${year}`
        ]);
        done();
      });
    });

    // TODO: getForRegion, getForCounty, getForType, getForEntity
  });
});

export default {lab};