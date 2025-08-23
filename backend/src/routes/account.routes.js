import { Router } from 'express';
import { body, param } from 'express-validator';
import { authRequired } from '../middleware/auth.js';
import { requireRole } from '../middleware/requireRole.js';
import { createAccount, getMyAccounts, getAccountByNumber, updateAccountStatus } from '../controllers/account.controller.js';
import { validate } from '../validation/validate.js';
import Account from '../models/Account.js';

const router = Router();

router.get('/', authRequired, requireRole('admin'), async (req, res, next) => {
	try {
		const accounts = await Account.find().sort({ createdAt: -1 }).limit(200);
		return res.json(accounts);
	} catch (err) {
		next(err);
	}
});

router.post(
	'/',
	authRequired,
	[body('type').isIn(['savings', 'current'])],
	validate,
	createAccount
);

router.get('/mine', authRequired, getMyAccounts);

router.get('/:accountNumber', authRequired, param('accountNumber').isString(), validate, getAccountByNumber);

router.patch(
	'/:accountNumber/status',
	authRequired,
	requireRole('admin'),
	[param('accountNumber').isString(), body('status').isIn(['active', 'suspended', 'closed'])],
	validate,
	updateAccountStatus
);

export default router;