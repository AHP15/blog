import express from 'express';

import authController from '../controllers/user/auth.controller.js';

const router = express.Router();

router.post('/user/auth/signup', authController.signup);

export default router;