const express = require('express');
const router = express.Router();
const accountController = require('../controllers/accountController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, accountController.getAccount);

module.exports = router;
