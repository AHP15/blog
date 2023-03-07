import DB from '../../models/index.js';
import ResponseError from '../../utils/errorHandler.js';

const User = DB.user;

const signup = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(201).send({
      success: true,
      user
    });
  } catch (err) {
    let message = '';

    if (err.errors) {
      const index = err.message.split('').findLastIndex(char => char === ':');
      message = err.message.slice(index + 2)
    } else if (err.keyValue){
      message = `user with ${err.keyValue.email} already exists`
    }

    if (message) {
      const error = new ResponseError(message, 400)
      res.status(error.statusCode).send({
        success: false,
        message: error.message ?? "Something went wrong!"
      });
      return;
    }

    next(err);
  }
};

export default { signup };