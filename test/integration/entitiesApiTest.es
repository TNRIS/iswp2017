import Code from 'code';
import Lab from 'lab';

import server from 'index.es';

const lab = Lab.script();

function testEntityShape(entity) {
  Code.expect(entity).to.include([
    'EntityId', 'EntityName', 'Latitude', 'Longitude', 'entityType'
  ]);
}

lab.test('entities - all', (done) => {
  server.inject('/api/v1/entities', (res) => {
    Code.expect(res.statusCode).to.equal(200);
    Code.expect(res.result).to.be.an.array();
    Code.expect(res.result.length).to.be.greaterThan(0);
    const first = res.result[0];
    testEntityShape(first);
    done();
  });
});

lab.test('entities - one', (done) => {
  server.inject('/api/v1/entities/7', (res) => {
    Code.expect(res.statusCode).to.equal(200);
    Code.expect(res.result).to.be.an.array();
    Code.expect(res.result.length).to.be.greaterThan(0);
    const first = res.result[0];
    testEntityShape(first);
    done();
  });
});

lab.test('entities - summary for one', (done) => {
  server.inject('/api/v1/entities/7/summary', (res) => {
    Code.expect(res.statusCode).to.equal(200);
    Code.expect(res.result).to.be.an.array();
    Code.expect(res.result.length).to.be.greaterThan(0);
    //TODO: test shape
    done();
  });
});

lab.test('entities - search by name', (done) => {
  server.inject('/api/v1/entities/search?name=Aus', (res) => {
    Code.expect(res.statusCode).to.equal(200);
    Code.expect(res.result).to.be.an.array();
    Code.expect(res.result.length).to.be.greaterThan(0);
    const first = res.result[0];
    testEntityShape(first);
    done();
  });
});

export default {lab};