import mongoose from 'mongoose';
import Account from '../models/Account.js';
import Transaction from '../models/Transaction.js';

export const deposit = async (req, res, next) => {
	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		const { accountNumber, amount } = req.body;
		if (amount <= 0) return res.status(400).json({ message: 'Amount must be positive' });
		const account = await Account.findOne({ accountNumber }).session(session);
		if (!account) return res.status(404).json({ message: 'Account not found' });
		if (account.status !== 'active') return res.status(400).json({ message: 'Account not active' });
		if (req.user.role !== 'admin' && String(account.userId) !== String(req.user.id)) {
			return res.status(403).json({ message: 'Forbidden' });
		}
		account.balance += amount;
		await account.save({ session });
		await Transaction.create([{ toAccount: accountNumber, amount, type: 'deposit' }], { session });
		await session.commitTransaction();
		return res.json({ balance: account.balance });
	} catch (err) {
		await session.abortTransaction();
		next(err);
	} finally {
		session.endSession();
	}
};

export const withdraw = async (req, res, next) => {
	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		const { accountNumber, amount } = req.body;
		if (amount <= 0) return res.status(400).json({ message: 'Amount must be positive' });
		const account = await Account.findOne({ accountNumber }).session(session);
		if (!account) return res.status(404).json({ message: 'Account not found' });
		if (account.status !== 'active') return res.status(400).json({ message: 'Account not active' });
		if (req.user.role !== 'admin' && String(account.userId) !== String(req.user.id)) {
			return res.status(403).json({ message: 'Forbidden' });
		}
		if (account.balance < amount) return res.status(400).json({ message: 'Insufficient balance' });
		account.balance -= amount;
		await account.save({ session });
		await Transaction.create([{ fromAccount: accountNumber, amount, type: 'withdraw' }], { session });
		await session.commitTransaction();
		return res.json({ balance: account.balance });
	} catch (err) {
		await session.abortTransaction();
		next(err);
	} finally {
		session.endSession();
	}
};

export const transfer = async (req, res, next) => {
	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		const { fromAccountNumber, toAccountNumber, amount } = req.body;
		if (amount <= 0) return res.status(400).json({ message: 'Amount must be positive' });
		if (fromAccountNumber === toAccountNumber) return res.status(400).json({ message: 'Cannot transfer to same account' });

		const from = await Account.findOne({ accountNumber: fromAccountNumber }).session(session);
		const to = await Account.findOne({ accountNumber: toAccountNumber }).session(session);
		if (!from || !to) return res.status(404).json({ message: 'Account not found' });
		if (from.status !== 'active' || to.status !== 'active') return res.status(400).json({ message: 'Accounts must be active' });
		if (req.user.role !== 'admin' && String(from.userId) !== String(req.user.id)) {
			return res.status(403).json({ message: 'Forbidden' });
		}
		if (from.balance < amount) return res.status(400).json({ message: 'Insufficient balance' });

		from.balance -= amount;
		to.balance += amount;
		await from.save({ session });
		await to.save({ session });
		await Transaction.create([{ fromAccount: fromAccountNumber, toAccount: toAccountNumber, amount, type: 'transfer' }], { session });
		await session.commitTransaction();
		return res.json({ fromBalance: from.balance, toBalance: to.balance });
	} catch (err) {
		await session.abortTransaction();
		next(err);
	} finally {
		session.endSession();
	}
};

export const history = async (req, res, next) => {
	try {
		const { accountNumber } = req.params;
		const account = await Account.findOne({ accountNumber });
		if (!account) return res.status(404).json({ message: 'Account not found' });
		if (req.user.role !== 'admin' && String(account.userId) !== String(req.user.id)) {
			return res.status(403).json({ message: 'Forbidden' });
		}
		const txns = await Transaction.find({
			$or: [{ fromAccount: accountNumber }, { toAccount: accountNumber }],
		})
			.sort({ createdAt: -1 })
			.limit(100);
		return res.json(txns);
	} catch (err) {
		next(err);
	}
};

export const listAll = async (req, res, next) => {
	try {
		const txns = await Transaction.find({}).sort({ createdAt: -1 }).limit(200);
		return res.json(txns);
	} catch (err) {
		next(err);
	}
};