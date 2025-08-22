const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/deposit', authenticateToken, transactionController.deposit);
router.post('/withdraw', authenticateToken, transactionController.withdraw);
router.post('/transfer', authenticateToken, transactionController.transfer);

module.exports = router;
