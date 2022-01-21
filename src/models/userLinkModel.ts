import mongoose from 'mongoose';

const userLinkSchema = new mongoose.Schema({
	type: {
		type: String,
		required: true,
		enum: ['forgotPassword', 'verifyEmail'],
	},
	link: { type: String, required: true },
	userId: { type: String, required: true },
	status: { type: Boolean, default: true },
	expired: { type: Date, default: Date.now() + 60 * 1000 },
});

const userlinkModel = mongoose.model('link', userLinkSchema);

export default userlinkModel;
