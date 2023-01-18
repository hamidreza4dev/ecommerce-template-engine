import { Router } from 'express';

import * as errorsController from './errors.controller.js';

const router = Router();

router.get('/500', errorsController.httpGet500);
router.get('/404', errorsController.httpGet404);

export default router;
