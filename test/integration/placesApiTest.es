import Code from 'code';
import Lab from 'lab';

import server from 'index.es';

const lab = Lab.script();

lab.test('get regions', (done) => {
  server.inject('/api/v1/regions', (res) => {
    Code.expect(res.statusCode).to.equal(200);
    Code.expect(res.result).to.be.an.object(); //GeoJSON
    done();
  });
});

export default {lab};