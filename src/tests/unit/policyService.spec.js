const { expect } = require('chai');
const { policyService } = require('.');
const { NotFoundError, ValueError } = require('../errors');
// I am aware that the name can be erased and therefore the tests would not work,
// but can't think of any other way of doing it
const SPEC_USERNAME = 'Manning';

describe('policyService', () => {
  let randomUser;

  describe('Get the list of policies linked to a user name', () => {
    before(async () => {
      randomUser = `user-${Math.random()}`;
    });

    it('should succeed on finding policies given a valid client', async () => {
      const resultPolicies = await policyService.findPoliciesByUserName({ userName: SPEC_USERNAME });
      expect(resultPolicies.length).to.be.at.least(1);
      expect(resultPolicies[0].length).to.be.at.least(1);
      expect(resultPolicies[0][0].id).to.exist;
      expect(resultPolicies[0][0].amountInsured).to.exist;
      expect(resultPolicies[0][0].email).to.exist;
      expect(resultPolicies[0][0].inceptionDate).to.exist;
      expect(resultPolicies[0][0].installmentPayment).to.exist;
      expect(resultPolicies[0][0].clientId).to.exist;
    });

    it('should fail given non valid name', async () => {
      try {
        const resultPolicies = await policyService.findPoliciesByUserName({ userName: randomUser });
      } catch (error) {
        expect(error).to.be.instanceOf(NotFoundError);
        expect(error.message).to.equal(`user with username: ${randomUser} not found`);
      }
    });

    it('should fail on given boolean username', async () => {
      const randomNonStringUser = false;
      try {
        const resultPolicies = await policyService.findPoliciesByUserName({ userName: randomNonStringUser });
      } catch (error) {
        expect(error).to.be.instanceOf(TypeError);
        expect(error.message).to.equal(`userName: ${randomNonStringUser} is not a string`);
      }
    });

    it('should fail on given empty userName', async () => {
      const emptyString = '';
      try {
        await policyService.findPoliciesByUserName({ userName: emptyString });
      } catch (error) {
        expect(error).to.be.instanceOf(ValueError);
        expect(error.message).to.equal('userName is empty or blank');
      }
    });
  });
});
