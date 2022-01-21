import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/appError';

export const forrbidenController = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const message = `Can't find ${req.originalUrl} on this server ! `;
	next(new AppError(message, 404));
};
