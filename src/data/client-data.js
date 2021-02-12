const axios = require('axios');
const config = require('../../config');

const { DATA_CLIENT_ENDPOINT, DATA_URL } = config;

// Corresponds to the clients of the company
const clientData = async ({ token }) => {
  const response = await axios.get(`${DATA_URL}/${DATA_CLIENT_ENDPOINT}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response && response.data;
};

module.exports = {
  clientData,
};
