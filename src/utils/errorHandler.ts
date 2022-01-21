import { Request, Response, NextFunction } from 'express';
import { logger } from '../services/loggerServices';

export const errorHandler =
	(fn: any) => (req: Request, res: Response, next: NextFunction) =>
		fn(req, res, next).catch((err: any) => {
			logger.log('error', err);
			return res.status(500).json({ message: 'Internal server error !' });
		});
