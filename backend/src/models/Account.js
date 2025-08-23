import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema(
	{
		accountNumber: { type: String, required: true, unique: true, index: true },
		type: { type: String, enum: ['savings', 'current'], required: true },
		balance: { type: Number, required: true, default: 0, min: 0 },
		userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
		status: { type: String, enum: ['active', 'suspended', 'closed'], default: 'active', index: true },
	},
	{ timestamps: true }
);

export default mongoose.model('Account', accountSchema);