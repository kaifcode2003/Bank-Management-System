import mongoose from 'mongoose';

export const connectToDatabase = async (mongoUri) => {
	mongoose.set('strictQuery', true);
	await mongoose.connect(mongoUri, {
		serverSelectionTimeoutMS: 10000,
	});
	return mongoose.connection;
};