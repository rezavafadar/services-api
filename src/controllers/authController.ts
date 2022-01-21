import { NextFunction, Request, Response } from 'express';

import authServices from '../services/authServices';
import emailServices from '../services/emailServices';
import { signToken } from '../services/jwtServices';
import AppError from '../utils/appError';
import filteredObj from '../utils/filteredObj';
import { randomStringGenerator } from '../utils/randomStringGenerator';
import userValidation from '../validation/user';

const register = async (req: Request, res: Response, next: NextFunction) => {
	const body = req.body;

	const validateBody = await userValidation(body);

	if (validateBody != null)
		return next(new AppError('Bad Request!', 400, validateBody));

	const bodyFiltered = filteredObj(body, 'username', 'email', 'password');
	const illegalEmail: string = randomStringGenerator(5);

	const registerResult = await authServices.register(
		bodyFiltered,
		illegalEmail
	);
	if (registerResult.code)
		return next(new AppError(registerResult.message, registerResult.code));

	const url = `${req.protocol}://${req.get(
		'host'
	)}/api/v1/auth/illegal-email/${illegalEmail}`;
	emailServices.sendWlcEmail(bodyFiltered.email, url);

	res.status(200).json({ message: 'successful!' });
};

const illegalEmail = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const token = req.params.token;

	if (!token) return next(new AppError('Url have not token !', 400));

	const illegalEmailResult = await authServices.illegalEmail(token);

	if (illegalEmailResult.code)
		return next(
			new AppError(illegalEmailResult.message, illegalEmailResult.code)
		);

	res.status(200).json({ message: 'successfull!' });
};

const login = async (req: Request, res: Response, next: NextFunction) => {
	const body = req.body;
	if (!body.username || !body.password)
		return next(
			new AppError('Bad Request!', 400, [
				'Username or Password is not defined!',
			])
		);

	const loginResult = await authServices.login(body);

	if (loginResult.code)
		return next(new AppError(loginResult.message, loginResult.code));

	const token = signToken({ id: loginResult._id });

	res.status(200).json({ message: 'successful !', data: loginResult, token });
};

const getVerifyEmail = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const body = req.body;

	if (!body.email)
		return next(new AppError('Bad Request!', 400, ['Email is required !']));

	const link = randomStringGenerator(6);

	const verifyEmailResult = await authServices.getVerifyEmail(body.email, link);

	if (verifyEmailResult.code)
		return next(
			new AppError(verifyEmailResult.message, verifyEmailResult.code)
		);

	const url = `${req.protocol}://${req.get(
		'host'
	)}/api/v1/auth/confirm-email/${link}`;

	emailServices.sendEmailVerify(body.email, url);

	res.status(200).json({ message: 'successful!' });
};

const confirmEmail = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const link = req.params.link;
	if (!link)
		return next(new AppError('Bad Request!', 400, ['Url have not link !']));

	const confirmEmailResult = await authServices.confirmEmail(link);

	if (confirmEmailResult.code)
		return res.status(confirmEmailResult.code).json({
			message: confirmEmailResult.message,
		});

	res.status(200).json({ message: 'successful !' });
};

const forgotPassword = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const body = req.body;
	if (!body.username)
		return next(new AppError('Bad Request!', 400, ['Username is required !']));

	const link = randomStringGenerator(5);

	const forgotPasswordResult = await authServices.forgotPassword(
		body.username,
		link
	);

	if (forgotPasswordResult.code)
		return next(
			new AppError(forgotPasswordResult.message, forgotPasswordResult.code)
		);

	const url = `${req.protocol}://${req.get(
		'host'
	)}/api/v1/auth/reset-password/${link}`;

	emailServices.sendForgotPassEmail(body.username, url);
	res.status(200).json({ message: 'successful!' });
};

const resetPassword = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const link = req.params.link;
	const body = req.body;

	if (!link)
		return next(new AppError('Bad Request!', 400, ['Url have not link !']));
	if (!body.newPassword)
		return next(
			new AppError('Bad Request!', 400, ['New password is required !'])
		);

	const resetPasswordResult = await authServices.resetPassword(
		link,
		body.newPassword
	);

	if (resetPasswordResult.code)
		return res
			.status(resetPasswordResult.code)
			.json({ message: resetPasswordResult.message });

	res.status(200).json({ message: 'successful !' });
};

export default {
	register,
	login,
	forgotPassword,
	resetPassword,
	getVerifyEmail,
	confirmEmail,
	illegalEmail,
};
