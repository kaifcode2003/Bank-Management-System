import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const signToken = (user) => {
	return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN || '7d',
	});
};

export const register = async (req, res, next) => {
	try {
		const { name, email, phone, password, kyc } = req.body;
		const existing = await User.findOne({ $or: [{ email }, { phone }] });
		if (existing) return res.status(409).json({ message: 'Email or phone already registered' });
		const passwordHash = await bcrypt.hash(password, 10);
		const user = await User.create({ name, email, phone, passwordHash, role: 'customer', kyc });
		const token = signToken(user);
		return res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
	} catch (err) {
		next(err);
	}
};

export const login = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		if (!user) return res.status(401).json({ message: 'Invalid credentials' });
		const ok = await bcrypt.compare(password, user.passwordHash);
		if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
		const token = signToken(user);
		return res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
	} catch (err) {
		next(err);
	}
};