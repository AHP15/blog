import mongoose from 'mongoose';

import {
  EMAIL_REG_EXP,
  USERNAME_REQUIRED,
  LONG_USERNAME,
  SHORT_USERNAME,
  EMAIL_REQUIRED,
  PASSWORD_REQUIRED,
  SHORT_PASSWORD
} from '../constants.js';

const { model, Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, USERNAME_REQUIRED],
    maxlength:[30, LONG_USERNAME],
    minlength:[4, SHORT_USERNAME],
  },
  email: {
    type: String,
    required: [true, EMAIL_REQUIRED],
    unique: true,
    validate: {
      validator: function(v) {
        return EMAIL_REG_EXP.test(v);
      },
      message: props => `${props.value} is not a valid email address!`
    },
  },
  password: {
    type: String,
    required: [true, PASSWORD_REQUIRED],
    minlength: [8, SHORT_PASSWORD],
    select: false,
  }
});

export default model('User', userSchema);
