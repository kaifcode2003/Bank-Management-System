const db = require('../config/database');

exports.getAccountInfo = (req, res) => {
    const userId = req.user.id;
    const query = `
        SELECT u.name, u.email, a.account_id, a.account_number, a.balance
        FROM users u
        JOIN accounts a ON u.user_id = a.user_id
        WHERE u.user_id = ?
    `;
    db.get(query, [userId], (err, accountData) => {
        if (err || !accountData) {
            return res.status(404).json({ message: 'Account not found.' });
        }
        const txQuery = `SELECT * FROM transactions WHERE account_id = ? ORDER BY timestamp DESC`;
        db.all(txQuery, [accountData.account_id], (txErr, transactions) => {
            if (txErr) {
                return res.status(500).json({ message: 'Error fetching transactions.' });
            }
            res.json({
                user: { name: accountData.name, email: accountData.email },
                account: { account_id: accountData.account_id, account_number: accountData.account_number, balance: accountData.balance },
                transactions
            });
        });
    });
};