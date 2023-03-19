import DB from '../../models/index.js';
import ResponseError from '../../utils/errorHandler.js';
import { EMAIL_REG_EXP } from '../../constants.js';

const User = DB.user;

const signup = async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(201).send({
    success: true,
    user
  });
};

const signin = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new ResponseError(`${email ? 'Password' : 'Email'} not provided`, 400);
  }

  if (!EMAIL_REG_EXP.test(email)) {
    throw new ResponseError(`${email} is not a valid email address!`, 400);
  }

  const user = await User.findOne({ email: email }).select('+password');

  if (!user) {
    throw new ResponseError(`user with ${email} not found`, 404);
  }

  const passwordValid = user.compatePasswords(password);

  if (!passwordValid) {
    throw new ResponseError('Incorrect password', 400);
  }

  res.status(200).send({
    success: true,
    user
  })

};

export default { signup, signin };