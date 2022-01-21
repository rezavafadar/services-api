import { NextFunction, Request, Response } from 'express';

import userService from '../services/userServices';
import AppError from '../utils/appError';
import filteredObj from '../utils/filteredObj';
import { UserInRequest } from '../types/user';
import { isValidObjectId } from 'mongoose';
import hashServices from '../services/hashServices';
import { uploadImg } from '../services/uploaderServices';

const getMe = async (req: UserInRequest, res: Response, next: NextFunction) => {
	if (req.user.role === 'admin' && req.params.id) return next();

	const user = req.user;
	user.illegalEmail = '';
	user.password = '';

	return res.status(200).json({
		message: 'successful !',
		data: user,
	});
};

const getUser = async (
	req: UserInRequest,
	res: Response,
	next: NextFunction
) => {
	const id = req.params.id;

	if (!id || !isValidObjectId(id))
		return next(
			new AppError('Bad Request!', 400, [
				'User Id is not defined or id is incorrect !',
			])
		);

	const user = await userService.findUserById(id);

	if (!user) return next(new AppError('User is not defined !', 404));

	return res.status(200).json({ message: 'successful!', data: user });
};

const editMe = async (
	req: UserInRequest,
	res: Response,
	next: NextFunction
) => {
	if (req.user.role === 'admin' && req.params.id) return next();

	const body = req.body;
	if (body.password || body.role)
		return next(
			new AppError('Bad Request!', 400, [
				'Your request contains security values !',
			])
		);

	const bodyFiltered = filteredObj(body, 'username', 'email');

	if (bodyFiltered.email && bodyFiltered.email !== req.user.email)
		bodyFiltered.isEmailVerify = false;

	await userService.updateUser(req.user.id, bodyFiltered);

	res.status(200).json({ message: 'successful !' });
};

const editUser = async (req: Request, res: Response, next: NextFunction) => {
	const id = req.params.id;
	const body = req.body;

	if (!id || !isValidObjectId(id))
		return next(
			new AppError('Bad Request!', 400, [
				'User Id is not defined or id is incorrect !',
			])
		);

	if (body.illegalEmail)
		return next(
			new AppError('You cannot edit user email illegal token !', 400)
		);

	if (body.password) body.password = await hashServices.hash(body.password);

	if (body.email || body.username) {
		const currentUser = await userService.findUserByUsernameOrEmail(
			body.username
		);
		if (currentUser)
			return next(
				new AppError('BadRequest!', 400, [
					'There is a user with this email or username',
				])
			);
	}

	await userService.updateUser(id, body);

	res.status(200).json({ message: 'successful!' });
};

const profileUploader = uploadImg.single('photo');

const uploadProfileImg = async (req: UserInRequest, res: Response) => {
	await userService.updateUser(req.user.id, { photo: req.file?.filename });

	res.status(200).json({ message: 'successfull!' });
};

const deactivateMe = async (
	req: UserInRequest,
	res: Response,
	next: NextFunction
) => {
	if (req.user.role === 'admin' && req.params.id) return next();

	await userService.deactivateUser(req.user.id);
	res.status(200).json({ message: 'successful !' });
};

const deactiveUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const id = req.params.id;

	if (!id || !isValidObjectId(id))
		return next(
			new AppError('Bad Request!', 400, [
				'User Id is not defined or id is incorrect !',
			])
		);

	await userService.deactivateUser(id);

	res.status(200).json({ message: 'successful!' });
};

const getUsers = async (req: Request, res: Response) => {
	const users = await userService.findUsers();

	return res.status(200).json({
		message: 'successful!',
		data: users,
	});
};

export default {
	getMe,
	getUser,
	editMe,
	deactivateMe,
	editUser,
	deactiveUser,
	getUsers,
	profileUploader,
	uploadProfileImg,
};
