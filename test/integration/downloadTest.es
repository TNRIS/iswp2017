
import R from 'ramda';
import Code from 'code';
import Lab from 'lab';
import Papa from 'papaparse';

import server from 'index.es';

const lab = Lab.script();

function testResponse(filename, res) {
  Code.expect(res.statusCode).to.equal(200);
  Code.expect(res.headers).to.include('content-type');
  Code.expect(res.headers['content-type']).to.include('text/csv');
  Code.expect(res.headers).to.include('content-disposition');
  Code.expect(res.headers['content-disposition']).to.include(`attachment; filename=${filename}`);

  const parseResult = Papa.parse(res.result, {header: true});
  Code.expect(parseResult.data).to.be.an.array();
  Code.expect(parseResult.data.length).to.be.greaterThan(0);

  const testDatum = parseResult.data[0];
  const keys = R.keys(testDatum);
  Code.expect(keys).to.not.be.null();
  Code.expect(keys.length).to.be.greaterThan(1);
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
      testResponse('entities.csv', res);
      done();
    });
  });

  themes.forEach((theme) => {
    lab.test(`statewide ${theme}`, (done) => {
      server.inject(`/download/statewide/${theme}`, (res) => {
        testResponse(`statewide_${theme}.csv`, res);
        done();
      });
    });
  });

  themes.forEach((theme) => {
    lab.test(`region ${theme}`, (done) => {
      server.inject(`/download/region/P/${theme}`, (res) => {
        testResponse(`region_p_${theme}.csv`, res);
        done();
      });
    });
  });

  themes.forEach((theme) => {
    lab.test(`county ${theme}`, (done) => {
      server.inject(`/download/county/King/${theme}`, (res) => {
        testResponse(`county_king_${theme}.csv`, res);
        done();
      });
    });
  });

  themes.forEach((theme) => {
    lab.test(`entity ${theme}`, (done) => {
      server.inject(`/download/entity/125/${theme}`, (res) => {
        testResponse(`entity_125_${theme}.csv`, res);
        done();
      });
    });
  });

  themes.forEach((theme) => {
    lab.test(`usagetype ${theme}`, (done) => {
      server.inject(`/download/usagetype/Municipal/${theme}`, (res) => {
        testResponse(`usagetype_municipal_${theme}.csv`, res);
        done();
      });
    });
  });
});

export default {lab};