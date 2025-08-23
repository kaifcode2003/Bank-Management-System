import mongoose from 'mongoose';

const kycSchema = new mongoose.Schema(
	{
		idType: { type: String },
		idNumber: { type: String },
		address: { type: String },
	},
	{ _id: false }
);

const userSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, trim: true },
		email: { type: String, required: true, unique: true, lowercase: true, index: true },
		phone: { type: String, required: true, unique: true },
		passwordHash: { type: String, required: true },
		role: { type: String, enum: ['customer', 'admin'], default: 'customer', index: true },
		kyc: kycSchema,
	},
	{ timestamps: true }
);

export default mongoose.model('User', userSchema);