import User from '../user.js';

import yup from 'yup';

yup.addMethod(yup.string, 'userExists', function (anyArgsYouNeed) {
  const { message } = anyArgsYouNeed;
  return this.test('exists', message, async function (value) {
    const { path, createError } = this;
    const user = await User.findOne({ email: value });
    if (user) {
      return createError({ path, message });
    } else {
      return this;
    }
  });
});

yup.addMethod(yup.string, 'userNotExists', function (anyArgsYouNeed) {
  const { message } = anyArgsYouNeed;
  return this.test('exists', message, async function (value) {
    const { path, createError } = this;
    const user = await User.findOne({ email: value });
    if (user) {
      return this;
    } else {
      return createError({ path, message });
    }
  });
});

export const registerValidationSchema = yup.object().shape({
  fullname: yup.string().required('fullname is required !'),
  email: yup
    .string()
    .required('email is required !')
    .userExists('a user with this email already exists !'),
  password: yup.string().required('password is required !'),
  confirmPassword: yup
    .string()
    .oneOf(
      [yup.ref('password')],
      'password and confirm password should be same .'
    ),
  role: yup.string().default('user').oneOf(['admin', 'user', 'seller']),
  acceptPolicy: yup.boolean().isTrue('you must accept our terms of service .'),
});

export const loginValidationSchema = yup.object().shape({
  email: yup
    .string()
    .required('email is required !')
    .userNotExists('a user with this email not exists !'),
  password: yup.string().required('password is required !'),
});

export const forgetValidationSchema = yup.object().shape({
  email: yup
    .string()
    .required('email is required !')
    .userNotExists('a user with this email not exists !'),
});

export const resetValidationSchema = yup.object().shape({
  password: yup.string().required('password is required !'),
  confirmPassword: yup
    .string()
    .oneOf(
      [yup.ref('password')],
      'password and confirm password should be same .'
    ),
});
