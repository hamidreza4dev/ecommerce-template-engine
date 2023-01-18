import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import {
  forgetValidationSchema,
  loginValidationSchema,
  registerValidationSchema,
  resetValidationSchema,
} from './secure/userValidation.js';

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user', 'seller'],
    default: 'user',
  },
  resetToken: String,
  resetTokenExpiration: Date,
  /* cart: [
    {
      product: {},
      quantity: {},
    }
  ] */
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();
  // generate hash and change password to hash
  bcrypt.hash(this.password, 10, (err, hash) => {
    if (err) return next(err);
    this.password = hash;
    return next();
  });
});

userSchema.statics.userRegisterValidation = function (body) {
  return registerValidationSchema.validate(body, { abortEarly: false });
};

userSchema.statics.userLoginValidation = function (body) {
  return loginValidationSchema.validate(body, { abortEarly: false });
};

userSchema.statics.userForgetValidation = function (body) {
  return forgetValidationSchema.validate(body, { abortEarly: false });
};

userSchema.statics.userRestValidation = function (body) {
  return resetValidationSchema.validate(body, { abortEarly: false });
};

const User = mongoose.model('User', userSchema);

export default User;
