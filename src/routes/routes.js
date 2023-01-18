import { Router } from 'express';

import { isAuth } from '../middlewares/auth.js';

import shopRoutes from './shop/shop.routes.js';
import errorsRoutes from './errors/errors.routes.js';
import authRoutes from './auth/auth.routes.js';
import dashboardRoutes from './dashboard/dashboard.routes.js';

const router = Router();

router.use(shopRoutes);
router.use(errorsRoutes);
router.use('/users', authRoutes);
router.use('/dashboard', isAuth, dashboardRoutes);

export default router;
