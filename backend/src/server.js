import dotenv from 'dotenv';
import app from './app.js';
import { connectToDatabase } from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 4000;

const start = async () => {
	try {
		await connectToDatabase(process.env.MONGODB_URI);
		app.listen(PORT, () => {
			console.log(`BankMate backend running on port ${PORT}`);
		});
	} catch (err) {
		console.error('Failed to start server:', err);
		process.exit(1);
	}
};

start();