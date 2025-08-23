import { Router } from 'express';
import authRoutes from './auth.routes.js';
import accountRoutes from './account.routes.js';
import transactionRoutes from './transaction.routes.js';
import userRoutes from './user.routes.js';

const router = Router();

router.get('/', (req, res) => {
	res.json({ message: 'BankMate API' });
});

router.use('/auth', authRoutes);
router.use('/accounts', accountRoutes);
router.use('/transactions', transactionRoutes);
router.use('/users', userRoutes);

export default router;