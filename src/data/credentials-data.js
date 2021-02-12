const axios = require('axios');
const config = require('../../config');

const {
  DATA_LOGIN_ENDPOINT, DATA_URL, DATA_ID, DATA_SECRET,
} = config;

// Corresponds to the clients of the company
const credentialsData = async () => {
  const response = await axios.post(`${DATA_URL}/${DATA_LOGIN_ENDPOINT}`, {
    client_id: DATA_ID,
    client_secret: DATA_SECRET,
  });

  return response && response.data;
};

module.exports = {
  credentialsData,
};
