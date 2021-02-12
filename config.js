const assert = require('assert');
const dotenv = require('dotenv');

// Read the env file
dotenv.config();

// capture the environment variables
const {
  DATA_URL,
  API_PORT,
  JWT_SECRET,
  HOST,
  DATA_CLIENT_ENDPOINT,
  DATA_POLICY_ENDPOINT,
  DEFAULT_PAGINATION_LIMIT,
  DATA_LOGIN_ENDPOINT,
  DATA_ID,
  DATA_SECRET,
  JWT_REFRESH_SECRET,
} = process.env;

// Validate the required config information
assert(DATA_URL, 'DATA_URL is required');
assert(API_PORT, 'API_PORT is required');
assert(JWT_SECRET, 'JWT_SECRET is required');
assert(JWT_REFRESH_SECRET, 'JWT_REFRESH_SECRET is required');
assert(HOST, 'LOCALHOST is required');
assert(DATA_CLIENT_ENDPOINT, 'DATA_CLIENT_ENDPOINT is required');
assert(DATA_POLICY_ENDPOINT, 'DATA_POLICY_ENDPOINT is required');
assert(DATA_LOGIN_ENDPOINT, 'DATA_LOGIN_ENDPOINT is required');
assert(DEFAULT_PAGINATION_LIMIT, 'DEFAULT_PAGINATION_LIMIT is required');
assert(DATA_ID, 'DATA_ID is required');
assert(DATA_SECRET, 'DATA_SECRET is required');

module.exports = {
  DATA_URL,
  API_PORT,
  JWT_SECRET,
  HOST,
  DATA_CLIENT_ENDPOINT,
  DATA_POLICY_ENDPOINT,
  DEFAULT_PAGINATION_LIMIT,
  DATA_LOGIN_ENDPOINT,
  DATA_ID,
  DATA_SECRET,
  JWT_REFRESH_SECRET,
};
