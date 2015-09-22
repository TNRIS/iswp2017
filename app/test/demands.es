import Code from 'code';
import Lab from 'lab';

import server from '../index';

const lab = Lab.script();
const years = ['2020', '2030', '2040', '2050', '2060', '2070'];


function testDemandsResult(res) {
  Code.expect(res.statusCode).to.equal(200);
  Code.expect(res.result).to.be.an.array();
  Code.expect(res.result.length).to.be.greaterThan(0);
}

lab.test('demands - all', (done) => {
  server.inject('/api/v1/demands', (res) => {
    testDemandsResult(res);
    const first = res.result[0];
    Code.expect(first).to.include(['EntityId', 'EntityName', 'WugType',
      'WugRegion', 'WugCounty', 'Value_2020', 'Value_2030', 'Value_2040',
      'Value_2050', 'Value_2060', 'Value_2070'
    ]);
    done();
  });
});

years.forEach((year) => {
  lab.test(`demands - all for ${year}`, (done) => {
    server.inject(`/api/v1/demands/${year}`, (res) => {
      testDemandsResult(res);
      const first = res.result[0];
      Code.expect(first).to.include(['EntityId', 'EntityName', 'WugType',
        'WugRegion', 'WugCounty', `Value_${year}`
      ]);
      done();
    });
  });
});

export default {lab};
