const axios = require('axios');
const jwt = require('jsonwebtoken');
const { NotFoundError } = require('../errors');
const validate = require('../utils/validate');
const {
  JWT_SECRET, JWT_REFRESH_SECRET,
} = require('../../config');
const { credentialsData } = require('../data');
const clientService = require('./clientService');

const TOKEN_EXPIRATION = '5 min';
const TOKEN_REFRESH_EXPIRATION = '1 day';

const userService = {
  /**
 * Authenticates the user given an email
 *
 * @param {string} email user's unique email
 *
 * @returns {Promise<Object>} returns a Promise with the user's token,
 *  refresh token and when it expires
 *
 * @throws {NotFoundError} if given email does not exist
 *
 */
  authenticateUser({ username }) {
    validate([{ key: 'username', value: username, type: String }]);
    return (async () => {
      // Find user by clientId
      let response;
      let user;
      let clientToken;
      try {
        response = await credentialsData();

        clientToken = response && response.token;
        user = await clientService.getClientsByUsername({ token: clientToken, username });
      } catch (err) {
        if (err.name === 'NotFoundError') throw new NotFoundError(`user  ${username} not found`);
        throw Error(err.message);
      }

      // Sign the token with user data
      const { id, role } = user;
      const token = jwt.sign({ sub: clientToken, role, id }, JWT_SECRET,
        { expiresIn: TOKEN_EXPIRATION });
      const refreshToken = jwt.sign({ sub: id, role }, JWT_REFRESH_SECRET,
        { expiresIn: TOKEN_REFRESH_EXPIRATION });
      return { token, refreshToken, expiresIn: TOKEN_EXPIRATION };
    })();
  },

  /**
 * Authenticates the user given an email
 *
 * @param {string} email user's unique email
 *
 * @returns {Promise<Object>} returns a Promise with the user's token,
 *  refresh token and when it expires
 *
 * @throws {NotFoundError} if given email does not exist
 *
 */
  generateNewToken({ id, role }) {
    validate([{ key: 'id', value: id, type: String }]);
    validate([{ key: 'role', value: role, type: String }]);
    return (async () => {
      let response;
      let clientToken;
      try {
        response = await credentialsData();
        clientToken = response && response.token;
      } catch (err) {
        throw Error(err.message);
      }
      // Sign the token with user data
      const newToken = jwt.sign({ sub: clientToken, role, id }, JWT_SECRET,
        { expiresIn: TOKEN_EXPIRATION });
      return { token: newToken, expiresIn: TOKEN_EXPIRATION };
    })();
  },

};

module.exports = userService;
