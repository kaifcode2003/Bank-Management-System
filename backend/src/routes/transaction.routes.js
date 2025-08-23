import { Router } from 'express';
import { body, param } from 'express-validator';
import { authRequired } from '../middleware/auth.js';
import { validate } from '../validation/validate.js';
import { deposit, withdraw, transfer, history, listAll } from '../controllers/transaction.controller.js';
import { requireRole } from '../middleware/requireRole.js';

const router = Router();

router.get('/', authRequired, requireRole('admin'), listAll);

router.post('/deposit', authRequired, [body('accountNumber').isString(), body('amount').isFloat({ gt: 0 })], validate, deposit);

router.post('/withdraw', authRequired, [body('accountNumber').isString(), body('amount').isFloat({ gt: 0 })], validate, withdraw);

router.post(
	'/transfer',
	authRequired,
	[body('fromAccountNumber').isString(), body('toAccountNumber').isString(), body('amount').isFloat({ gt: 0 })],
	validate,
	transfer
);

router.get('/history/:accountNumber', authRequired, [param('accountNumber').isString()], validate, history);

export default router;