import { NextFunction, Request, Response } from 'express';

interface ErrorDocument {
	statusCode: number;
	status: string;
	message: string;
	errors: (string | number)[];
}

function errorController(
	error: ErrorDocument,
	req: Request,
	res: Response,
	next: NextFunction
) {
	return res.status(error.statusCode).json({
		message: error.message,
		status: error.status,
		errors: error.errors,
	});
}

export default errorController;
