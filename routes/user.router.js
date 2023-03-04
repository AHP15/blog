import express from 'express';

const router = express.Router();

router.post('/user/signup', (req, res) => {
  res.status(201).send({ user: req.body });
});

export default router;