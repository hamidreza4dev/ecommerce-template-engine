import { Router } from 'express';

import { isAuth } from '../../middlewares/auth.js';
import * as authController from './auth.controller.js';

const router = Router();

router.get('/login', authController.httpGetLogin);
router.post('/login', authController.httpPostLogin);
router.get('/register', authController.httpGetRegister);
router.post('/register', authController.httpPostRegister);
router.get('/forget-password', authController.httpGetForgetPassword);
router.post('/forget-password', authController.httpPostForgetPassword);
router.get('/reset-password/:token', authController.httpGetResetPassword);
router.post('/reset-password', authController.httpPostResetPassword);
router.get('/logout', isAuth, authController.httpGetLogout);

export default router;
