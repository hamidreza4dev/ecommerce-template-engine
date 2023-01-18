import { Router } from 'express';

import * as adminController from './admin.controller.js';

const router = Router();

router.get('/', adminController.httpGetIndex);
router.get('/products', adminController.httpGetProducts);

export default router;
