const express = require('express');
const routeHandler = require('../route-handler');
const { userService } = require('../../logic');
const bearerTokenParser = require('../../middleware/bearer-token-parser');

const router = express.Router();

// authenticate user
router.post('/login', bearerTokenParser, (req, res) => {
  routeHandler(async () => {
    const { client_id: clientId, client_secret: clientSecret } = req.body;

    const userData = await userService.authenticateUser({ clientId, clientSecret });

    res.json({
      message: 'Logged in!',
      data: userData,
    });
  }, res);
});

module.exports = router;
