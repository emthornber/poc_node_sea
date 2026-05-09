const chai = require('chai');
const expect = chai.expect;
// const chaiAsPromised = require('chai-as-promised')
// chai.use(chaiAsPromised);
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const rewire = require('rewire');

const mongoose = require('mongoose');

const sandbox = sinon.createSandbox();

let todoController = rewire('../controllers/todo.controller');

describe('Testing /todo endpoint', () => {
  let sampletodoVal;
  let findOneStub;
  const sampleUniqueHash = '1234567891';

  beforeEach(() => {
    sampletodoVal = {
      name: 'sample todo',
      price: 10,
      rating: "5",
      hash: sampleUniqueHash
    };

    findOneStub = sandbox.stub(mongoose.Model, 'findOne').resolves(sampletodoVal);
  });

  afterEach(() => {
    todoController = rewire('../controllers/todo.controller');
    sandbox.restore();
  });

  describe('GET /:hash', () => {
    it('should return error when called without hash', async () => {
      todoController.readtodo()
        .then(() => {
          throw new Error('⚠️ Unexpected success!');
        })
        .catch((err) => {
          expect(result).to.be.instanceOf(Error);
          expect(err.message).to.equal('Invalid todo id');
        })
    });

    it('should succeed when called with hash', async () => {
      todoController.readtodo('someRandomHash')
        .then((todo) => {
          expect(todo).to.equal(sampletodoVal);
        })
        .catch((err) => {
          throw new Error('⚠️ Unexpected failure!');
        })
    });
  });

  describe('PUT /', () => {
    let getUniqueHashStub, saveStub, result, sampleUpdatedtodoVal;
    const sampleUpdatedHash = '9876543219';

    beforeEach(async () => {
      // forcefully restore sandbox to allow re-write of findOneStub
      sandbox.restore();

      // Stub to mock getUniqueHash's Functionality
      getUniqueHashStub = sandbox.stub().returns(sampleUpdatedHash);

      sampleUpdatedtodoVal = {
        ...sampletodoVal,
        hash: sampleUpdatedHash
      };
      // save stub to return updated todo
      saveStub = sandbox.stub().returns(sampleUpdatedtodoVal);

      // make findOneStub return save() method in addition to sampletodoVal
      findOneStub = sandbox.stub(mongoose.Model, 'findOne').resolves({
        ...sampletodoVal,
        save: saveStub
      });

      // Use rewire to modify todoController's private method getUniqueHash
      todoController.__set__('getUniqueHash', getUniqueHashStub);
    });

    it('should throw invalid argument error', () => {
      todoController.updatetodoHash()
        .then(() => {
          throw new Error('⚠️ Unexpected success!');
        })
        .catch(err => {
          expect(result).to.be.instanceOf(Error);
          expect(err.message).to.equal('Incomplete arguments');
        })
    });

    it('should update todo hash successfully', async () => {
      result = await todoController.updatetodoHash(sampleUniqueHash);
      expect(findOneStub).to.have.been.calledWith({
        hash: sampleUniqueHash
      });
      expect(findOneStub).to.have.been.calledOnce;
      expect(saveStub).to.have.been.calledOnce;
      expect(result).to.equal(sampleUpdatedtodoVal);
    });
  });

  describe('POST /', () => {
    let todoModelStub, saveStub, result;

    beforeEach(async () => {
      saveStub = sandbox.stub().returns(sampletodoVal);
      todoModelStub = sandbox.stub().returns({
        save: saveStub
      });

      todoController.__set__('todo', todoModelStub);
    });

    it('should throw invalid argument error', () => {
      todoController.createtodo()
        .then(() => {
          throw new Error('⚠️ Unexpected success!');
        })
        .catch(err => {
          expect(result).to.be.instanceOf(Error);
          expect(err.message).to.equal('Invalid arguments');
        })
    });

    it('should create todo successfully', async () => {
      result = await todoController.createtodo(sampletodoVal);
      expect(todoModelStub).to.have.been.calledWithNew;
      expect(todoModelStub).to.have.been.calledWith(sampletodoVal);
      expect(saveStub).to.have.been.called;
      expect(result).to.equal(sampletodoVal);
    });
  });
});