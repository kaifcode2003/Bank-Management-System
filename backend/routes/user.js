const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.use(authenticateToken);
router.put('/profile', userController.updateUserProfile);
router.put('/password', userController.changeUserPassword);

module.exports = router;