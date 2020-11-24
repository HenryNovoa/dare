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
} = process.env;

// Validate the required config information
assert(DATA_URL, 'DATA_URL is required');
assert(API_PORT, 'API_PORT is required');
assert(JWT_SECRET, 'JWT_SECRET is required');
assert(HOST, 'LOCALHOST is required');

module.exports = {
  DATA_URL,
  API_PORT,
  JWT_SECRET,
  HOST,
};
