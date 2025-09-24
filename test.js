const request = require('supertest');
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World! Welcome to your CI/CD Node.js Application!');
});

describe('GET /', () => {
  it('should return Hello World', (done) => {
    request(app)
      .get('/')
      .expect('Content-Type', /text/)
      .expect(200, 'Hello World! Welcome to your CI/CD Node.js Application!', done);
  });
});
