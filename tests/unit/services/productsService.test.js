const { expect } = require('chai');
const sinon = require('sinon');
const productsService = require('../../../src/services/productsService');
const productsModel = require('../../../src/models/productsModel');

describe('Service Tests', () => {
  describe('Success & failure', () => {
    afterEach(() => sinon.restore());
    it('findAll w/ data', async () => {

      sinon.stub(productsModel, 'findAll').resolves([
        [
          {
            "id": 1,
            "name": "Martelo de Thor"
          },
        ],
      ]);

      const result = await productsService.findAll();

      expect(result).to.be.an('array');
      expect(result).to.have.length(1);
      expect(result).to.deep.equal([
        [
          {
            "id": 1,
            "name": "Martelo de Thor"
          },
        ],
      ]);
    });
  });

  describe('Product search', () => {
    afterEach(() => sinon.restore());

    it('Non-existing ID', async function () {

      sinon.stub(productsModel, 'findById').resolves(undefined);

      const result = await productsService.findById(37);

      expect(result).to.equal(undefined);
    });

    it('Existing ID ', async () => {

      sinon.stub(productsModel, 'findById').resolves([[
        {
          "id": 1,
          "name": "Martelo de Thor"
        },
      ],
      ]);

      const result = await productsService.findById(1);

      expect(result).to.deep.equal([[
        {
          "id": 1,
          "name": "Martelo de Thor"
        },
      ],]);
    });
  });

  describe('Insert tests', () => {
    const product = {
      "id": 1,
      "name": "Excalibur"
    };
    const invalidValue = {
      name: 'Oi',
    };
    afterEach(() => sinon.restore());
    it('Invalid name', async () => {

      const result = await productsService.insert(invalidValue);

      expect(result.type).to.equal('INVALID_VALUE');
      expect(result.message).to.equal('"name" length must be at least 5 characters long');
    });

    it('Insert ok', async () => {
      sinon.stub(productsModel, 'insert').resolves(1);
      sinon.stub(productsModel, 'findById').resolves(product[0]);

      const result = await productsService.insert(product);

      expect(result.type).to.equal(undefined);
      expect(result.message).to.deep.equal(product[0]);
    });

  });
});