process.env.NODE_ENV = 'test';

const request = require('supertest');

const app = require('./app');
const db = require('./db');

test('404 not found for nonexistant path', async () => {
    const res = await request(app).get('/does-not-exist');
    expect(res.statusCode).toBe(404);
});

afterAll(() => {
    db.end();
})