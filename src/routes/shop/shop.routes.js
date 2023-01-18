import { Router } from 'express';

import * as shopController from './shop.controller.js';

const router = Router();

router.get('/', shopController.httpGetIndex);

export default router;
