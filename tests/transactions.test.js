const request = require('supertest');
const { redis } = require('../api/libs/db');
const { app, server } = require('../api');

afterAll((done) => {
  // Closing the DB connection allows Jest to exit successfully.
  redis.disconnect();
  server.close();
  done();
});

describe('GET /api/txs', () => {
  it('should return one page transactions', async () => {
    const res = await request(app).get('/api/txs?a=0xeb2a81e229b68c1c22b6683275c00945f9872d90');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(50);
  });
  it('two pages should return different transactions', async () => {
    const res = await request(app).get('/api/txs?a=0xeb2a81e229b68c1c22b6683275c00945f9872d90');
    const res2 = await request(app).get('/api/txs?a=0xeb2a81e229b68c1c22b6683275c00945f9872d90&p=2');
    expect(res.statusCode).toBe(200);
    expect(res2.statusCode).toBe(200);
    expect(res.body.length).toBe(50);
    expect(res2.body.length).toBe(50);
    const different = res.body.every((trans) => !res2.body.find((e) => e.txnHash === trans.txnHash));
    expect(different).toBe(true);
  });
  it('without address should return error', async () => {
    const res = await request(app).get('/api/txs');
    expect(res.statusCode).toBe(500);
  });
  it('address wrong should return empty', async () => {
    const res = await request(app).get('/api/txs?a=wrong_address');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(0);
  });
});
