import mongoose from 'mongoose';

const creditCodeSchema = new mongoose.Schema({
	code: { type: String, required: true },
	amount: { type: Number, required: true },
	expiresTime: { type: Date, default: Date.now() + 60 * 60 * 1000 },
	users: [{ type: String }],
	status: { type: Boolean, default: true },
});

const creditCodeModel = mongoose.model('creditCode', creditCodeSchema);

export default creditCodeModel;
