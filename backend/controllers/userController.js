const bcrypt = require('bcryptjs');
const db = require('../config/database');

exports.updateUserProfile = (req, res) => {
    const { name } = req.body;
    const userId = req.user.id;
    if (!name) {
        return res.status(400).json({ message: 'Name field cannot be empty.' });
    }
    const sql = 'UPDATE users SET name = ? WHERE user_id = ?';
    db.run(sql, [name, userId], function(err) {
        if (err) {
            return res.status(500).json({ message: 'Error updating profile.' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.json({ message: 'Profile updated successfully!' });
    });
};

exports.changeUserPassword = (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;
    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'All password fields are required.' });
    }
    db.get('SELECT password FROM users WHERE user_id = ?', [userId], async (err, user) => {
        if (err || !user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect current password.' });
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        const sql = 'UPDATE users SET password = ? WHERE user_id = ?';
        db.run(sql, [hashedNewPassword, userId], function(err) {
            if (err) {
                return res.status(500).json({ message: 'Error updating password.' });
            }
            res.json({ message: 'Password changed successfully!' });
        });
    });
};