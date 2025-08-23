import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { connectToDatabase } from '../src/config/db.js';
import User from '../src/models/User.js';
import Account from '../src/models/Account.js';
import { generateAccountNumber } from '../src/utils/generateAccountNumber.js';

dotenv.config();

const run = async () => {
	await connectToDatabase(process.env.MONGODB_URI);
	try {
		const adminEmail = process.env.ADMIN_DEFAULT_EMAIL;
		const adminPass = process.env.ADMIN_DEFAULT_PASSWORD;
		let admin = await User.findOne({ email: adminEmail });
		if (!admin) {
			const passwordHash = await bcrypt.hash(adminPass, 10);
			admin = await User.create({ name: 'Admin', email: adminEmail, phone: '9999999999', passwordHash, role: 'admin' });
			console.log('Admin created:', admin.email);
		}

		let customer = await User.findOne({ email: 'customer@bankmate.local' });
		if (!customer) {
			const passwordHash = await bcrypt.hash('Customer@12345', 10);
			customer = await User.create({ name: 'John Customer', email: 'customer@bankmate.local', phone: '8888888888', passwordHash, role: 'customer' });
			console.log('Customer created:', customer.email);
		}

		const existingAccounts = await Account.find({ userId: customer._id });
		if (existingAccounts.length === 0) {
			await Account.create([
				{ accountNumber: generateAccountNumber(), type: 'savings', userId: customer._id, balance: 1000 },
				{ accountNumber: generateAccountNumber(), type: 'current', userId: customer._id, balance: 5000 },
			]);
			console.log('Sample accounts created for customer');
		}

		console.log('Seeding complete');
	} catch (err) {
		console.error(err);
	} finally {
		await mongoose.disconnect();
		process.exit(0);
	}
};

run();