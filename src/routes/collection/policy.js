const express = require('express');
const routeHandler = require('../route-handler');
const { policyService } = require('../../logic');

const router = express.Router();

// Get the list of policies linked to a user name
router.get('/policy', (req, res) => {
  routeHandler(async () => {
    const policies = await policyService.getpolicies();

    res.json({
      message: 'policies found',
      data: policies,
    });
  }, res);
});

module.exports = router;
