import express from 'express';

import authController from '../controllers/user/auth.controller.js';
import ResponseError, { handleError } from '../utils/errorHandler.js';

const router = express.Router();

router.post('/user/auth/signup', (req, res) => {
  authController.signup(req, res).catch((err) => {
    let message = 'Something went wrong!';

    if (err.errors) {
      const index = err.message.split('').findLastIndex(char => char === ':');
      message = err.message.slice(index + 2)
    } else if (err.keyValue) {
      message = `user with ${err.keyValue.email} already exists`
    }
  
    handleError(new ResponseError(message, 400), res)
  });
});

router.post('/user/auth/signin',  (req, res) => {
  authController.signin(req, res).catch((err) => handleError(err, res));
});

export default router;
