import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
	username: { required: true, type: String },
	email: { required: true, type: String },
	photo: { required: false, type: String, default: 'default.jpg' },
	credit: { type: Number, default: 0 },
	password: { required: true, type: String },
	role: { type: String, default: 'user' },
	active: { type: Boolean, default: true },
	isEmailVerify: { type: Boolean, default: false },
	illegalEmail: { type: String, required: true },
});

const userModel = mongoose.model('user', userSchema);

export default userModel;
