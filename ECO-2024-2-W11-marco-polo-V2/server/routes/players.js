const express = require('express');
const playersController = require('../controllers/players');
const router = express.Router();

// Define routes and link them to controller methods
router.get('/', playersController.getPlayers);


module.exports = router;