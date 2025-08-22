const db = require('../config/database');

// Deposit
exports.deposit = (req, res) => {
    const { amount } = req.body;
    const userId = req.user.id;
    if (!amount || amount <= 0) return res.status(400).json({ message: 'Invalid deposit amount.' });

    db.get('SELECT account_id, balance FROM accounts WHERE user_id = ?', [userId], (err, account) => {
        if (err || !account) return res.status(404).json({ message: 'Account not found.' });

        const newBalance = account.balance + amount;
        db.serialize(() => {
            db.run('BEGIN TRANSACTION');
            db.run('UPDATE accounts SET balance = ? WHERE account_id = ?', [newBalance, account.account_id]);
            db.run('INSERT INTO transactions (account_id, type, amount) VALUES (?, ?, ?)', [account.account_id, 'DEPOSIT', amount]);
            db.run('COMMIT', () => res.json({ message: 'Deposit successful!', newBalance }));
        });
    });
};

// Withdraw
exports.withdraw = (req, res) => {
    const { amount } = req.body;
    const userId = req.user.id;
    if (!amount || amount <= 0) return res.status(400).json({ message: 'Invalid withdrawal amount.' });

    db.get('SELECT account_id, balance FROM accounts WHERE user_id = ?', [userId], (err, account) => {
        if (err || !account) return res.status(404).json({ message: 'Account not found.' });
        if (account.balance < amount) return res.status(400).json({ message: 'Insufficient funds.' });

        const newBalance = account.balance - amount;
        db.serialize(() => {
            db.run('BEGIN TRANSACTION');
            db.run('UPDATE accounts SET balance = ? WHERE account_id = ?', [newBalance, account.account_id]);
            db.run('INSERT INTO transactions (account_id, type, amount) VALUES (?, ?, ?)', [account.account_id, 'WITHDRAWAL', amount]);
            db.run('COMMIT', () => res.json({ message: 'Withdrawal successful!', newBalance }));
        });
    });
};

// Transfer
exports.transfer = (req, res) => {
    const { toAccountNumber, amount } = req.body;
    const fromUserId = req.user.id;
    if (!amount || amount <= 0) return res.status(400).json({ message: 'Invalid transfer amount.' });

    db.all('SELECT account_id, user_id, balance, account_number FROM accounts WHERE user_id = ? OR account_number = ?', [fromUserId, toAccountNumber], (err, accounts) => {
        if (err) return res.status(500).json({ message: 'Database error.' });

        const fromAccount = accounts.find(acc => acc.user_id === fromUserId);
        const toAccount = accounts.find(acc => acc.account_number === toAccountNumber);

        if (!fromAccount) return res.status(404).json({ message: 'Your account not found.' });
        if (!toAccount) return res.status(404).json({ message: 'Recipient account not found.' });
        if (fromAccount.account_id === toAccount.account_id) return res.status(400).json({ message: 'Cannot transfer to your own account.' });
        if (fromAccount.balance < amount) return res.status(400).json({ message: 'Insufficient funds.' });

        const newFromBalance = fromAccount.balance - amount;
        const newToBalance = toAccount.balance + amount;

        db.serialize(() => {
            db.run('BEGIN TRANSACTION');
            db.run('UPDATE accounts SET balance = ? WHERE account_id = ?', [newFromBalance, fromAccount.account_id]);
            db.run('UPDATE accounts SET balance = ? WHERE account_id = ?', [newToBalance, toAccount.account_id]);
            db.run('INSERT INTO transactions (account_id, type, amount, related_account_number) VALUES (?, ?, ?, ?)', [fromAccount.account_id, 'TRANSFER_DEBIT', amount, toAccount.account_number]);
            db.run('INSERT INTO transactions (account_id, type, amount, related_account_number) VALUES (?, ?, ?, ?)', [toAccount.account_id, 'TRANSFER_CREDIT', amount, fromAccount.account_number]);
            db.run('COMMIT', () => res.json({ message: 'Transfer successful!' }));
        });
    });
};
