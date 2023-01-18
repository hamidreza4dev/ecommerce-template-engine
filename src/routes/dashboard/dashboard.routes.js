import { Router } from 'express';

import adminRoutes from './admin/admin.routes.js';

const router = Router();

router.use((req, res, next) => {
  res.locals.layout = './layouts/dashboard';
  res.locals.username = req.user.fullname;
  next();
});
router.use(adminRoutes);

export default router;
