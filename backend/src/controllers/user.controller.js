import User from '../models/User.js';

export const listUsers = async (req, res, next) => {
	try {
		const users = await User.find({}, 'name email phone role createdAt').sort({ createdAt: -1 }).limit(200);
		return res.json(users);
	} catch (err) {
		next(err);
	}
};