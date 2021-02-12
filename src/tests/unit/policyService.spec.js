const axios = require('axios');
const sinon = require('sinon');
const { expect } = require('chai');
const clients = require('../stub-data/clients.json');
const policies = require('../stub-data/policies.json');
const { policyService, userService } = require('../../logic');
const { NotFoundError, ValueError } = require('../../errors');

const SPEC_USERNAME = 'britneyblankenship@quotezart.com';
const SPEC_CREDENTIALS = {
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRJZCI6ImRhcmUiLCJpYXQiOjE2MTMwOTk5MjEsImV4cCI6MTYxMzEwMDUyMX0.DroO-YxN8CGvBsYwlvl2S2pdyQmUKTb690vMkDMDM_8',
  type: 'Bearer',
};
const SPEC_POLICY_ID = '64cceef9-3a01-49ae-a23b-3761b604800b';
const SPEC_ROLE = 'admin';

describe('policyService', () => {
  let randomUser;
  let token;
  before(async () => {
    const credentials = sinon.stub(axios, 'post');
    credentials.resolves({ data: SPEC_CREDENTIALS });
    const data = sinon.stub(axios, 'get');
    data.resolves({ data: [...clients.clients] });
    const user = await userService.authenticateUser({ username: SPEC_USERNAME });
    token = user.token;
    axios.get.restore();
    axios.post.restore();
  });
  describe('Get policies by Id', () => {
    beforeEach(async () => {
      randomUser = `user-${Math.random()}`;
      const data = sinon.stub(axios, 'get');
      data.resolves({ data: [...policies.policies] });
    });

    it('should succeed on finding policies given a valid id', async () => {
      const resultPolicies = await policyService.getPoliciesById({ token, policyId: SPEC_POLICY_ID, role: SPEC_ROLE });

      expect(resultPolicies.length).to.be.at.least(1);
      expect(resultPolicies[0].id).to.exist;
      expect(resultPolicies[0].amountInsured).to.exist;
      expect(resultPolicies[0].email).to.exist;
      expect(resultPolicies[0].inceptionDate).to.exist;
      expect(resultPolicies[0].installmentPayment).to.exist;
      expect(resultPolicies[0].clientId).to.exist;
    });

    it('should fail given non valid policy id', async () => {
      try {
        const resultPolicies = await policyService.getPoliciesById({ token, policyId: 'random', role: SPEC_ROLE });
      } catch (error) {
        expect(error).to.be.instanceOf(NotFoundError);
        expect(error.message).to.equal(`user with username: ${randomUser} not found`);
      }
    });

    it('should fail on given boolean username', async () => {
      const randomNonStringUser = false;
      try {
        const resultPolicies = await policyService.getPoliciesById({ token, policyId: randomNonStringUser, role: SPEC_ROLE });
      } catch (error) {
        expect(error).to.be.instanceOf(TypeError);
        expect(error.message).to.equal(`policyId: ${randomNonStringUser} is not a string`);
      }
    });

    it('should fail on given empty userName', async () => {
      const emptyString = '';
      try {
        await policyService.getPoliciesById({ token, policyId: emptyString, role: SPEC_ROLE });
      } catch (error) {
        expect(error).to.be.instanceOf(ValueError);
        expect(error.message).to.equal('policyId is empty or blank');
      }
    });
    afterEach(() => {
      axios.get.restore();
    });
  });
});
