import mongoose from 'mongoose';
import userSchema from '../models/userModel';

export interface CreateUserData {
	username: string;
	email: string;
	password: string;
	illegalEmail: string;
}

const createUser = (user: CreateUserData) => {
	return userSchema.create(user);
};

const findUserByUsernameOrEmail = (username: string) => {
	return userSchema.findOne({
		$or: [{ email: username }, { username }],
		$and: [{ active: true }],
	});
};

const findUserById = (id: string) => {
	return userSchema.findOne({ _id: id, active: true });
};

const updateUser = (id: string, updateFields: object) => {
	return userSchema.updateOne({ _id: id }, updateFields);
};

const deactivateUser = (id: string) => {
	return userSchema.findByIdAndUpdate(id, { active: false });
};

const findIllegalEmail = (token: string) => {
	return userSchema.findOne({ illegalEmail: token, active: true });
};

const deleteUser = (id: string) => {
	return userSchema.deleteOne({ id });
};

const findUsers = () => {
	return userSchema.find({});
};

export default {
	findUserByUsernameOrEmail,
	createUser,
	updateUser,
	findUserById,
	deactivateUser,
	findIllegalEmail,
	deleteUser,
	findUsers,
};
