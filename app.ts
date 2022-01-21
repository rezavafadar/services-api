import express from 'express';

import apiRoutes from './routes/api';
import globalErrorHandler from './controllers/errorController';
import { forrbidenController } from './controllers/forbiddenController';
import { logger } from './services/loggerServices';
import winston from 'winston';

function createApp(config?: any) {
	const app = express();

	const isDev = process.env.NODE_ENV === 'development';
	if (isDev)
		logger.add(
			new winston.transports.Console({ format: winston.format.simple() })
		);

	// middlewares
	app.use(express.json());
	app.use(express.urlencoded({ extended: false }));
	app.use(express.static('public'));

	// routes
	app.use('/api/v1/', apiRoutes);
	app.all('*', forrbidenController);
	app.use(globalErrorHandler);

	const PORT: string | number = config?.PORT || process.env.PORT || 3000;

	return {
		listen: () =>
			app.listen(PORT, () =>
				console.log(
					`Server is running on port ${PORT} and ${process.env.NODE_ENV} mode`
				)
			),
	};
}

export default createApp;
