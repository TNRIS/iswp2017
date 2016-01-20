

import Code from 'code';
import Lab from 'lab';

import server from 'index.es';

const lab = Lab.script();

lab.experiment('places api', () => {
  lab.before((done) => {
    //wait until plugins are registered
    //  it would be better if the server notified when plugins were registered, but
    //  that functionality doesn't seem to exist
    setTimeout(done, 500);
  });

  lab.test('regions for county', (done) => {
    server.inject('/api/v1/places/county/Hays/regions', (res) => {
      Code.expect(res.statusCode).to.equal(200);
      Code.expect(res.result).to.be.an.array();
      Code.expect(res.result.length).to.equal(2);
      Code.expect(res.result[0]).to.equal('K');
      Code.expect(res.result[1]).to.equal('L');
      done();
    });
  });
});

export default {lab};