
import Code from 'code';
import Lab from 'lab';

import server from 'index.es';

const lab = Lab.script();

function testCsv(filename, res) {
  Code.expect(res.statusCode).to.equal(200);
  Code.expect(res.headers).to.include('content-type');
  Code.expect(res.headers['content-type']).to.include('text/csv');
  Code.expect(res.headers).to.include('content-disposition');
  Code.expect(res.headers['content-disposition']).to.include(`attachment; filename=${filename}`);
}

lab.experiment('download', () => {
  lab.before((done) => {
    //wait until plugins are registered
    //  it would be better if the server notified when plugins were registered, but
    //  that functionality doesn't seem to exist
    setTimeout(done, 500);
  });

  const themes = ['demands', 'needs', 'supplies', 'population', 'strategies'];

  lab.test('entities', (done) => {
    server.inject(`/download/entities`, (res) => {
      testCsv('entities.csv', res);
      done();
    });
  });

  themes.forEach((theme) => {
    lab.test(`statewide ${theme}`, (done) => {
      server.inject(`/download/statewide/${theme}`, (res) => {
        testCsv(`statewide_${theme}.csv`, res);
        done();
      });
    });
  });

  themes.forEach((theme) => {
    lab.test(`region ${theme}`, (done) => {
      server.inject(`/download/region/P/${theme}`, (res) => {
        testCsv(`region_p_${theme}.csv`, res);
        done();
      });
    });
  });

  themes.forEach((theme) => {
    lab.test(`county ${theme}`, (done) => {
      server.inject(`/download/county/King/${theme}`, (res) => {
        testCsv(`county_king_${theme}.csv`, res);
        done();
      });
    });
  });

  themes.forEach((theme) => {
    lab.test(`entity ${theme}`, (done) => {
      server.inject(`/download/entity/125/${theme}`, (res) => {
        testCsv(`entity_125_${theme}.csv`, res);
        done();
      });
    });
  });

  themes.forEach((theme) => {
    lab.test(`usagetype ${theme}`, (done) => {
      server.inject(`/download/usagetype/Municipal/${theme}`, (res) => {
        testCsv(`usagetype_municipal_${theme}.csv`, res);
        done();
      });
    });
  });
});

export default {lab};