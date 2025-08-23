import Account from '../models/Account.js';
import { generateAccountNumber } from '../utils/generateAccountNumber.js';

export const createAccount = async (req, res, next) => {
	try {
		const { type } = req.body;
		const accountNumber = generateAccountNumber();
		const account = await Account.create({ accountNumber, type, userId: req.user.id, balance: 0 });
		return res.status(201).json(account);
	} catch (err) {
		next(err);
	}
};

export const getMyAccounts = async (req, res, next) => {
	try {
		const accounts = await Account.find({ userId: req.user.id }).sort({ createdAt: -1 });
		return res.json(accounts);
	} catch (err) {
		next(err);
	}
};

export const getAccountByNumber = async (req, res, next) => {
	try {
		const { accountNumber } = req.params;
		const account = await Account.findOne({ accountNumber });
		if (!account) return res.status(404).json({ message: 'Account not found' });
		if (req.user.role !== 'admin' && String(account.userId) !== String(req.user.id)) {
			return res.status(403).json({ message: 'Forbidden' });
		}
		return res.json(account);
	} catch (err) {
		next(err);
	}
};

export const updateAccountStatus = async (req, res, next) => {
	try {
		const { accountNumber } = req.params;
		const { status } = req.body; // suspended | closed | active
		const account = await Account.findOneAndUpdate(
			{ accountNumber },
			{ status },
			{ new: true }
		);
		if (!account) return res.status(404).json({ message: 'Account not found' });
		return res.json(account);
	} catch (err) {
		next(err);
	}
};