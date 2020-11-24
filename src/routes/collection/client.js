const express = require('express');
const routeHandler = require('../route-handler');
const { clientService } = require('../../logic');

const router = express.Router();

// Get the list of clients
router.get('/client', (req, res) => {
  routeHandler(async () => {
    const clients = await clientService.getClients();

    res.json({
      message: 'clients found',
      data: clients,
    });
  }, res);
});

module.exports = router;
