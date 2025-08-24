const express = require('express');
const cors = require('cors');
const db = require('./config/database');

// --- Route Imports ---
const authRoutes = require('./routes/auth');
const accountRoutes = require('./routes/accounts');
const transactionRoutes = require('./routes/transactions');
const userRoutes = require('./routes/user'); // <-- NEW

// --- Basic Setup ---
const app = express();
const PORT = process.env.PORT || 3000;  // ✅ use Render's dynamic port

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- API Routes ---
app.use('/api', authRoutes);
app.use('/api/account', accountRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/user', userRoutes); // <-- NEW

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log('✅ Database connected');
});
