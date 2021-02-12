const policyData = require('./policy-data');
const clientData = require('./client-data');
const credentialsData = require('./credentials-data');

module.exports = {
  ...policyData,
  ...clientData,
  ...credentialsData,
};
