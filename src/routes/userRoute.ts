import { Router } from 'express';

import { protect } from '../middlewares/protect';
import { errorHandler } from '../utils/errorHandler';
import userController from '../controllers/userController';

const userRouter = Router();

userRouter.get(
	'/users',
	errorHandler(protect('admin')),
	errorHandler(userController.getUsers)
);

userRouter.use(errorHandler(protect('user', 'admin')));

userRouter.get(
	'/user/:id?',
	errorHandler(userController.getMe),
	errorHandler(userController.getUser)
);

userRouter.post(
	'/edit/:id?',
	errorHandler(userController.editMe),
	errorHandler(userController.editUser)
);

userRouter.post(
	'/profile-img',
	userController.profileUploader,
	errorHandler(userController.uploadProfileImg)
);

userRouter.delete(
	'/delete/:id?',
	errorHandler(userController.deactivateMe),
	errorHandler(userController.deactiveUser)
);

export default userRouter;
