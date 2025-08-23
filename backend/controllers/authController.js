const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const JWT_SECRET = 'your_super_secret_key_that_is_very_long_and_secure';

exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please provide name, email, and password.' });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const accountNumber = `GB${Date.now()}`;
        db.serialize(() => {
            db.run('BEGIN TRANSACTION');
            const userStmt = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
            userStmt.run(name, email, hashedPassword, function(err) {
                if (err) {
                    db.run('ROLLBACK');
                    return res.status(400).json({ message: 'Email already exists.' });
                }
                const userId = this.lastID;
                const accountStmt = db.prepare('INSERT INTO accounts (user_id, account_number, balance) VALUES (?, ?, ?)');
                accountStmt.run(userId, accountNumber, 1000, function(err) { // Start with $1000 for demo
                    if (err) {
                        db.run('ROLLBACK');
                        return res.status(500).json({ message: 'Failed to create account.' });
                    }
                    db.run('COMMIT');
                    res.status(201).json({ message: 'User registered successfully!' });
                });
                accountStmt.finalize();
            });
            userStmt.finalize();
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error during registration.' });
    }
};

exports.loginUser = (req, res) => {
    const { email, password } = req.body;
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err || !user) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }
        const token = jwt.sign({ id: user.user_id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    });
};