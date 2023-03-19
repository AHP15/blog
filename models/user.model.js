import mongoose from 'mongoose';
import bcrypt from "bcryptjs";

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
  },
  photo: String,
  createdAt:{
    type:Date,
    default:Date.now
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }]
});

userSchema.pre("save", function(next){
    
  if(this.isModified("password")){
    this.password = bcrypt.hashSync(this.password, 10);
  }
  next();
});

userSchema.methods.compatePasswords = function(clientPassword){
  return bcrypt.compareSync(clientPassword, this.password);
}

// Generate a reset password token
userSchema.methods.getResetPasswordToken = function(){
    
  // Generating token
  const resetToken = crypto.randomBytes(20).toString("hex");
  // Hashing and adding resetPasswordToken to userSchema
  this.resetPasswordToken = crypto.createHash("sha256")
                                  .update(resetToken)
                                  .digest("hex");
  // Expire after 24 hours
  this.resetPasswordExpire = Date.now() + 86400 * 1000;

  return resetToken;

}

export default model('User', userSchema);
