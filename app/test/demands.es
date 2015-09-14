import Code from 'code';
import Lab from 'lab';

import server from '../index';
const lab = Lab.script();

lab.test('demands api', (done) => {
  server.inject('/api/v1/demands/2020', (res) => {
    Code.expect(res.result).to.be.an.array();
    Code.expect(1+1).to.equal(2);
    done()
  });
});

export default {lab};
