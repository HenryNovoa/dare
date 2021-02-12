const axios = require('axios');
const sinon = require('sinon');
const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const clients = require('../stub-data/clients.json');

chai.use(chaiHttp);

const URL = 'http://localhost:3000/api';

const SPEC_USERNAME = 'britneyblankenship@quotezart.com';
const SPEC_CREDENTIALS = {
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRJZCI6ImRhcmUiLCJpYXQiOjE2MTMwOTk5MjEsImV4cCI6MTYxMzEwMDUyMX0.DroO-YxN8CGvBsYwlvl2S2pdyQmUKTb690vMkDMDM_8',
  type: 'Bearer',
};
const SPEC_POLICY_ID = '64cceef9-3a01-49ae-a23b-3761b604800b';

describe('policyService', () => {
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
    it('should succeed on finding policies given a valid id', async () => {
      chai.request(`${URL}`)
        .get(`/policies/${SPEC_POLICY_ID}`)
        .set({ Authorization: `Bearer ${token}` })
        .then((resultPolicies) => {
          console.log(resultPolicies.status);

          expect(resultPolicies.length).to.be.at.least(1);
          expect(resultPolicies[0].id).to.exist;
          expect(resultPolicies[0].amountInsured).to.exist;
          expect(resultPolicies[0].email).to.exist;
          expect(resultPolicies[0].inceptionDate).to.exist;
          expect(resultPolicies[0].installmentPayment).to.exist;
          expect(resultPolicies[0].clientId).to.exist;
        });
    });
  });
});
