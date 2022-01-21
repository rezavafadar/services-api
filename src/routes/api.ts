import { Router } from 'express';

import userRoutes from './userRoute';
import authRoutes from './authRoute';
import creditRoutes from './creditRoute';

const apiRouter = Router();

apiRouter.use('/user', userRoutes);
apiRouter.use('/auth', authRoutes);
apiRouter.use('/credit', creditRoutes);

export default apiRouter;
