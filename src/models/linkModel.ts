import mongoose from 'mongoose';

export interface linkDoc {
	type: 'forgotPassword' | 'verifyEmail';
	link: string;
	userId: string;
	status?: boolean;
	expired?: Date;
	createAt?: Date;
}

export interface LinkFindDocument extends linkDoc {
	expired: Date;
	id: string;
}

const linkSchema = new mongoose.Schema({
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

const linkModel = mongoose.model('link', linkSchema);

export default linkModel;
