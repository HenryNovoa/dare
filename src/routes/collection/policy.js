const express = require('express');
const routeHandler = require('../route-handler');
const { policyService } = require('../../logic');
const bearerParserToken = require('../../middleware/bearer-token-parser');
const authorize = require('../../middleware/authorize');
const Role = require('../../utils/role');

const router = express.Router();

// Get the list of policies
router.get('/policies', [bearerParserToken, authorize([Role.admin, Role.users])], (req, res) => {
  const { sub, role, id } = req;
  routeHandler(async () => {
    const { limit } = req.query;
    const policies = await policyService.getPolicies({
      token: sub, limit, role, id,
    });

    res.json({
      message: 'policies found',
      data: policies,
    });
  }, res);
});

// Get a particular policy (or policies) by id
router.get('/policies/:policyId', [bearerParserToken, authorize([Role.admin, Role.users])], (req, res) => {
  const { sub, role, id } = req;
  const { policyId } = req.params;
  routeHandler(async () => {
    const policies = await policyService.getPoliciesById({
      token: sub, policyId, role, id,
    });

    res.json({
      message: 'policies found',
      data: policies,
    });
  }, res);
});

module.exports = router;
