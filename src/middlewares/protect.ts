import { NextFunction, Request, Response } from 'express';

import { UserDocument } from '../models/userModel';
import { verifyToken } from '../services/jwtServices';
import userService from '../services/userServices';
import AppError from '../utils/appError';

export interface UserInRequest extends Request {
	user: UserDocument;
}

export const protect =
	(...access: string[]) =>
	async (
		req: UserInRequest,
		res: Response,
		next: NextFunction
	): Promise<any> => {
		if (
			!req.headers.authorization ||
			!req.headers.authorization.startsWith('Bearer')
		) {
			return next(new AppError('BadReques!', 400, ['You are not logged in !']));
		}

		let token: string = req.headers.authorization.split(' ')[1];

		let decoded: any = verifyToken(token);
		if (decoded === false)
			return next(new AppError('BadRequest!', 400, ['Token is invalid !']));

		const user: UserDocument = await userService.findUserById(decoded.id);
		if (!user) return next(new AppError('User is not defined !', 404));

		if (access.length > 0 && !access.includes(user.role))
			return next(
				new AppError('BadRequest!', 400, [
					'You have not access to this route !',
				])
			);

		req.user = user;

		next();
	};
