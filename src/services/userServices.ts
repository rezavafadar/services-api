import userSchema from '../models/userModel';

import { CreateUser } from '../types/user';

const createUser = (user: CreateUser) => {
	return userSchema.create(user);
};

const findUsers = () => {
	return userSchema.find({});
};

const findUserByUsernameOrEmail = (username: string) => {
	return userSchema.findOne({
		$or: [{ email: username }, { username }],
		$and: [{ active: true }],
	});
};

const findIllegalEmail = (token: string) => {
	return userSchema.findOne({ illegalEmail: token, active: true });
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

const deleteUser = (id: string) => {
	return userSchema.deleteOne({ id });
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
