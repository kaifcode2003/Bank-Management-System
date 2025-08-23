export const requireRole = (roles) => (req, res, next) => {
	const allowed = Array.isArray(roles) ? roles : [roles];
	if (!req.user) return res.status(401).json({ message: 'Unauthenticated' });
	if (!allowed.includes(req.user.role)) {
		return res.status(403).json({ message: 'Forbidden: insufficient role' });
	}
	next();
};