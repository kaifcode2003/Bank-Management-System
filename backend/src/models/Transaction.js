import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
	{
		fromAccount: { type: String },
		toAccount: { type: String },
		amount: { type: Number, required: true, min: 0 },
		type: { type: String, enum: ['deposit', 'withdraw', 'transfer'], required: true },
	},
	{ timestamps: true }
);

transactionSchema.index({ fromAccount: 1, createdAt: -1 });
transactionSchema.index({ toAccount: 1, createdAt: -1 });

export default mongoose.model('Transaction', transactionSchema);