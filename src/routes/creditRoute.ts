import { Router } from 'express';

import { errorHandler } from '../utils/errorHandler';
import creditController from '../controllers/creditController';
import { protect } from '../middlewares/protect';

const creditRouter = Router();

creditRouter.get(
	'/apply/:code',
	errorHandler(protect('user', 'admin')),
	errorHandler(creditController.applyCode)
);

creditRouter.use(errorHandler(protect('admin')));

creditRouter.delete('/delete/:id', errorHandler(creditController.deleteCode));
creditRouter.post('/add', errorHandler(creditController.createCode));
creditRouter.get('/code/:id', errorHandler(creditController.getCode));
creditRouter.get('/all', errorHandler(creditController.getAllCode));

export default creditRouter;
