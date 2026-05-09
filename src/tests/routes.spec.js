const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const rewire = require('rewire');
const request = require('supertest');

const healthCheckController = require('../controllers/health.controller');
const todoController = require('../controllers/todo.controller');

const sandbox = sinon.createSandbox();

let app = rewire('../app');

describe('Testing express app routes', () => {

  afterEach(() => {
    app = rewire('../app');
    sandbox.restore();
  });

  describe('GET /health', () => {
    beforeEach(() => {
      sandbox.stub(healthCheckController, 'healthCheckSync').returns('OK');
      sandbox.stub(healthCheckController, 'healthCheckAsync').resolves('OK');
    });

    it('/sync should succeed', (done) => {
      request(app).get('/health/sync')
        .expect(200)
        .end((err, response) => {
          expect(response.body).to.have.property('health').to.equal('OK');
          done(err);
        });
    });

    it('/async should succeed', (done) => {
      request(app).get('/health/async')
        .expect(200)
        .end((err, response) => {
          expect(response.body).to.have.property('health').to.equal('OK');
          done(err);
        });
    });
  });


  describe('Testing /todo route', () => {
    let sampletodoVal, hash;

    beforeEach(() => {
      hash = '1234567891';
      sampletodoVal = {
        name: 'sample todo',
        price: 10,
        rating: "5",
        hash
      };
      sandbox.stub(todoController, 'readtodo').resolves(sampletodoVal);
      sandbox.stub(todoController, 'createtodo').resolves(sampletodoVal);
      sandbox.stub(todoController, 'updatetodoHash').resolves(sampletodoVal);
    });

    it('GET /:hash should successfully return todo', (done) => {
      request(app).get(`/todo/${hash}`)
        .expect(200)
        .end((err, response) => {
          expect(response.body).to.have.property('message').to.equal('todo read successfully!');
          expect(response.body).to.have.property('todo').to.have.property('name').to.equal('sample todo');
          expect(response.body).to.have.property('todo').to.have.property('price').to.equal(10);
          expect(response.body).to.have.property('todo').to.have.property('rating').to.equal('5');
          expect(response.body).to.have.property('todo').to.have.property('hash').to.equal(hash);
          done(err); // err is null in success scenario
        });
    });

    it('POST / should successfully create a new todo', (done) => {
      request(app).post('/todo/')
        .send(sampletodoVal)
        .expect(200)
        .end((err, response) => {
          expect(response.body).to.have.property('message').to.equal('todo created successfully!');
          expect(response.body).to.have.property('todo').to.have.property('name').to.equal('sample todo');
          expect(response.body).to.have.property('todo').to.have.property('price').to.equal(10);
          expect(response.body).to.have.property('todo').to.have.property('rating').to.equal('5');
          expect(response.body).to.have.property('todo').to.have.property('hash').to.equal(hash);
          done(err);
        });
    });

    it('PUT / should successfully update hash for a given todo', (done) => {
      request(app).put('/todo')
        .send(hash)
        .expect(200)
        .end((err, response) => {
          expect(response.body).to.have.property('message').to.equal('todo updated successfully!');
          expect(response.body).to.have.property('todo').to.have.property('name').to.equal('sample todo');
          expect(response.body).to.have.property('todo').to.have.property('price').to.equal(10);
          expect(response.body).to.have.property('todo').to.have.property('rating').to.equal('5');
          expect(response.body).to.have.property('todo').to.have.property('hash').to.equal(hash);
          done(err);
        });
    });
  });
});