const { NotAllowedError, NotFoundError } = require('../errors');
const validate = require('../utils/validate');
const { policyData } = require('../data');
const { DEFAULT_PAGINATION_LIMIT } = require('../../config');
const Role = require('../utils/role');

const policyService = {
  /**
 * Gets different policies
 *
 * @param {string} token user's unique token to make sure you are able to access the endpoint
 *
 * @param {string} limit number of items to be served. Default is 10
 *
 * @param {string} role the user's role
 *
 * @param {string} id the user's id
 *
 * @returns {Promise<Object>} returns a Promise with the user's token and id
 *
 * @throws {NotFoundError} if given email does not exist
 *
 */
  getPolicies({
    token, limit, role, id,
  }) {
    validate([{ key: 'token', value: token, type: String }, {
      key: 'limit', value: limit, type: String, optional: true,
    }, { key: 'role', value: role, type: String },
    {
      key: 'id', value: id, type: String,
    },
    ]);
    let queryLimit = limit;

    if (!queryLimit) {
      queryLimit = DEFAULT_PAGINATION_LIMIT;
    }

    return (async () => {
      // Find user by token
      let policies;
      try {
        policies = await policyData({ token });
      } catch (err) {
        if (err.response && err.response.status === 401) throw new NotAllowedError('Not authorized');
        throw Error(err.message);
      }

      let result;
      if (role === Role.admin) {
        result = policies && policies.slice(0, queryLimit);
      } else if (role === Role.users) {
        const filteredPolicies = policies && policies.filter((policy) => policy.clientId === id);
        result = filteredPolicies && filteredPolicies.slice(0, queryLimit);
      }
      return result;
    })();
  },

  /**
 * Gets different policies
 *
 * @param {string} token user's unique token to make sure you are able to access the endpoint
 * @param {string} policyId policyId to search for
 *
 * @returns {Promise<Object>} returns a Promise with the user's token and id
 *
 * @throws {NotFoundError} if given email does not exist
 * @throws {NotAllowedError} if token is not valid or expired
 *
 */
  getPoliciesById({ token, policyId, role }) {
    validate([{ key: 'token', value: token, type: String }, { key: 'policyId', value: policyId, type: String }]);
    return (async () => {
    // Find user by token
      let result;
      try {
        result = await policyData({ token });
      } catch (err) {
        if (err.response && err.response.status === 401) throw new NotAllowedError('Not authorized');
        throw Error(err.message);
      }

      let policies;
      if (role === Role.users) {
        policies = result
                        && result.filter((insurancePolicy) => insurancePolicy.id === policyId);
      } else if (role === Role.admin) {
        policies = [...result];
      }

      if (policies && !policies.length) {
        throw new NotFoundError(`Policies with id ${policyId} not found`);
      }
      return policies;
    })();
  },

};

module.exports = policyService;
