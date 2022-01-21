import { Router } from 'express';

import authController from '../controllers/authController';
import { errorHandler } from '../utils/errorHandler';

const authRouter = Router();

authRouter.post('/register', errorHandler(authController.register));

authRouter.post('/login', errorHandler(authController.login));

authRouter.post(
	'/forgot-password',
	errorHandler(authController.forgotPassword)
);

authRouter.post(
	'/reset-password/:link',
	errorHandler(authController.resetPassword)
);

authRouter.post('/verify-email', errorHandler(authController.getVerifyEmail));

authRouter.get(
	'/confirm-email/:link',
	errorHandler(authController.confirmEmail)
);

authRouter.get(
	'/illegal-email/:token',
	errorHandler(authController.illegalEmail)
);

export default authRouter;
