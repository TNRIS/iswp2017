
import Code from 'code';
import Lab from 'lab';

import server from 'index.es';

const lab = Lab.script();

lab.experiment('downloads', () => {
  lab.before((done) => {
    //wait until plugins are registered
    //  it would be better if the server notified when plugins were registered, but
    //  that functionality doesn't seem to exist
    setTimeout(done, 500);
  });

  const downloads = ['demands', 'needs', 'supplies', 'population', 'strategies', 'entities'];

  downloads.forEach((name) => {
    lab.test(`download ${name}`, (done) => {
      server.inject(`/download/${name}.csv`, (res) => {
        Code.expect(res.statusCode).to.equal(200);
        Code.expect(res.headers).to.include('content-type');
        Code.expect(res.headers['content-type']).to.include('text/csv');
        Code.expect(res.headers).to.include('content-disposition');
        Code.expect(res.headers['content-disposition']).to.include(`attachment; filename=${name}.csv`);
        done();
      });
    });
  });

});

export default {lab};