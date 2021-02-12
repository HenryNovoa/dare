const express = require('express');
const routeHandler = require('../route-handler');
const { clientService } = require('../../logic');
const bearerParserToken = require('../../middleware/bearer-token-parser');
const authorize = require('../../middleware/authorize');
const Role = require('../../utils/role');

const router = express.Router();

// Get the list of clients
router.get('/clients', [bearerParserToken, authorize([Role.admin, Role.users])], (req, res) => {
  const { sub, role, id } = req;
  const { limit, name } = req.query;

  routeHandler(async () => {
    const clients = await clientService.getClients({
      token: sub, limit, name, role, id,
    });

    res.json({
      message: 'clients found',
      data: clients,
    });
  }, res);
});

// Get a client based on the id that is given
router.get('/clients/:clientId', [bearerParserToken, authorize([Role.admin, Role.users])], (req, res) => {
  const { sub, role, id } = req;
  const { clientId } = req.params;
  console.log(sub);
  routeHandler(async () => {
    const clients = await clientService.getClientsById({
      token: sub, clientId, role, id,
    });

    res.json({
      message: 'clients found',
      data: clients,
    });
  }, res);
});

// Get a client based on the id that is given
router.get('/clients/:clientId/policies', [bearerParserToken, authorize([Role.admin, Role.users])], (req, res) => {
  const { sub, role, id } = req;
  const { clientId } = req.params;
  routeHandler(async () => {
    const clients = await clientService.getPoliciesByClientId({
      token: sub, clientId, role, id,
    });

    res.json({
      message: 'clients found',
      data: clients,
    });
  }, res);
});
module.exports = router;
