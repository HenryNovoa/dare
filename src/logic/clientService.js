const { NotFoundError, NotAllowedError } = require('../errors');
const validate = require('../utils/validate');
const { clientData, policyData } = require('../data');
const { DEFAULT_PAGINATION_LIMIT } = require('../../config');
const Role = require('../utils/role');

const clientService = {
  /**
 * Gets the clients
 *
 * @param {string} token represents the token to be able to fetch the data
 * @param {string} limit represents the number of items to be returned (default 10)
 * @param {string} name  search for a certain name
 * @param {string} role  the role of the user making the request
 * @param {string} id  the id of the user making the request
 *
 * @returns {Promise<Object>} returns a Promise with the clients data
 *
 * @throws {NotAllowedError} if token expires or is not valid
 *
 */
  getClients({
    token, limit, name, role, id,
  }) {
    validate([{ key: 'token', value: token, type: String }, {
      key: 'limit', value: limit, type: String, optional: true,
    }, {
      key: 'name', value: name, type: String, optional: true,
    }, {
      key: 'role', value: role, type: String,
    }, {
      key: 'id', value: id, type: String,
    },
    ]);

    return (async () => {
    // Find user by token
      let clients;

      let queryLimit = limit;

      if (!queryLimit) {
        queryLimit = DEFAULT_PAGINATION_LIMIT;
      }

      try {
        clients = await clientData({ token });
      } catch (err) {
        if (err.response && err.response.status === 401) throw new NotAllowedError('Not authorized');
        throw Error(err.message);
      }
      let result;
      if (name && Role.admin) {
        result = clients && clients.filter((client) => client.name === name);
        return result.slice(0, queryLimit);
      }

      if (Role.users === role) {
        return clients && clients.filter((client) => client.id === id);
      }

      // this result corresponds if the role is admin and there is no name in the query
      result = clients && clients.slice(0, queryLimit);
      return result;
    })();
  },

  /**
 * Searches for client by username
 *
 * @param {string} token represents the token to be able to fetch the data
 * @param {string} username username to search for
 *
 *
 * @returns {Promise<Object>} returns a Promise with the user's token and id
 *
 * @throws {NotAllowedError} token not valid or expired
 * @throws {NotFoundError} if no name was found during the search
 *
 */
  getClientsByUsername({ token, username }) {
    validate([{ key: 'username', value: username, type: String }]);
    return (async () => {
      let clients;
      try {
        clients = await clientData({ token });
      } catch (err) {
        if (err.response && err.response.status === 401) throw new NotAllowedError('Not authorized');
        throw Error(err.message);
      }
      const result = clients && clients.filter((client) => client.email === username);

      if (result && !result.length) {
        throw new NotFoundError(`No username with name ${username} found`);
      }

      return result && result[0];
    })();
  },
  /**
 * Searches for client by their Id
 *
 * @param {string} token represents the token to be able to fetch the data
 * @param {string} clientId id to search for
 * @param {string} role  the role of the user making the request
 * @param {string} id  the id of the user making the request
 *
 *
 * @returns {Promise<Object>} returns a Promise with the client's data
 *
 * @throws {NotAllowedError} token not valid or expired
 * @throws {NotFoundError} if no name was found during the search
 *
 */
  getClientsById({
    token, clientId, role, id,
  }) {
    validate([{ key: 'token', value: token, type: String }, { key: 'clientId', value: clientId, type: String }, {
      key: 'role', value: role, type: String,
    }, {
      key: 'id', value: id, type: String,
    }]);
    return (async () => {
      // Find user by token
      let result;
      try {
        result = await clientData({ token });
      } catch (err) {
        if (err.response && err.response.status === 401) throw new NotAllowedError('Not authorized');
        throw Error(err.message);
      }
      let client;
      if (role === Role.admin) {
        client = result && result.filter((clients) => clients.id === clientId);
      }

      if (role === Role.users) {
        client = result && result.filter((clients) => clients.id === id);
      }

      if (client && !client.length) {
        throw new NotFoundError('No client found');
      }
      return client;
    })();
  },

  /**
 * Searches for policies by their clientId
 *
 * @param {string} token represents the token to be able to fetch the data
 * @param {string} clientId id to search for
 * @param {string} role  the role of the user making the request
 * @param {string} id  the id of the user making the request
 *
 *
 * @returns {Promise<Object>} returns a Promise with the client's data
 *
 * @throws {NotAllowedError} token not valid or expired
 * @throws {NotFoundError} if no name was found during the search
 *
 */
  getPoliciesByClientId({
    token, clientId, role, id,
  }) {
    validate([{ key: 'token', value: token, type: String }, { key: 'clientId', value: clientId, type: String }, {
      key: 'role', value: role, type: String,
    }, {
      key: 'id', value: id, type: String,
    }]);
    return (async () => {
    // Find user by token
      let policies;

      try {
        policies = await policyData({ token });
      } catch (err) {
        if (err.response && err.response.status === 401) throw new NotAllowedError('Not authorized');
        throw Error(err.message);
      }

      let resultPolicies;
      if (role === Role.admin) {
        resultPolicies = policies && policies.filter((policy) => policy.clientId === clientId);
      }
      if (role === Role.users) {
        resultPolicies = policies && policies.filter((policy) => policy.clientId === id);
      }
      if (resultPolicies && !resultPolicies.length) {
        throw new NotFoundError('Policies not found for the client');
      }
      return resultPolicies;
    })();
  },

};

module.exports = clientService;
