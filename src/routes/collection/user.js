const express = require('express');
const jwt = require('jsonwebtoken');
const routeHandler = require('../route-handler');
const { userService } = require('../../logic');
const { JWT_REFRESH_SECRET } = require('../../../config');
const bearerTokenParser = require('../../middleware/bearer-token-parser');

const router = express.Router();

// authenticate user
router.post('/login', bearerTokenParser, (req, res) => {
  routeHandler(async () => {
    const { username } = req.body;
    const userData = await userService.authenticateUser({ username });

    res.json({
      ...userData,
    });
  }, res);
});

// authenticate user
router.post('/refreshToken', bearerTokenParser, (req, res) => {
  routeHandler(async () => {
    const { token } = req;
    const { sub, role } = jwt.verify(token, JWT_REFRESH_SECRET);

    const userData = await userService.generateNewToken({ id: sub, role });

    res.json({
      ...userData,
    });
  }, res);
});

module.exports = router;
