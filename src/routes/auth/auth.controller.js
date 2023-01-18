import passport from 'passport';
import yup from 'yup';
import jwt from 'jsonwebtoken';

import { PORT } from '../../../app.js';
import User from '../../models/user.js';
import captcha from '../../utils/gcaptcha.js';
import { transporter } from '../../utils/mailer.js';

/**
 * GET login
 * @route /users/login
 * @type {import('express').RequestHandler}
 */
export const httpGetLogin = (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Account | login',
    errorMessages: req.flash('error'),
  });
};

/**
 * POSt login
 * @route /users/login
 * @type {import('express').RequestHandler}
 */
export const httpPostLogin = async (req, res, next) => {
  try {
    // captcha
    const captchaHandle = await captcha.captchaValidation(
      req.body['g-recaptcha-response'],
      req.socket.remoteAddress
    );

    // validation
    const { fullname, email, password } = req.body;
    await User.userLoginValidation(req.body);

    // check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      req.flash('error', 'cannot find any user with this email .');
      return res.redirect('/users/login');
    }

    // authenticate user and redirect
    passport.authenticate('local', {
      failureRedirect: '/users/login',
      failureFlash: true,
      successRedirect: '/dashboard',
    })(req, res, next);
  } catch (error) {
    // yup validation error
    if (error instanceof yup.ValidationError) {
      req.flash('error', error.errors);
      return res.redirect('/users/login');
    }

    // captcha error handling (CUSTOM ERROR) from (./utils/gcapthca.js)
    if (error instanceof captcha.CaptchaValidationError) {
      req.flash('error', error.message);
      return res.redirect('/users/login');
    }

    // handle other errors
    const err = new Error(error);
    err.httpStatusCode = 500;
    next(err);
  }
};

/**
 * GET register
 * @route /users/register
 * @type {import('express').RequestHandler}
 */
export const httpGetRegister = (req, res, next) => {
  res.render('auth/register', {
    pageTitle: 'Account | register',
    errorMessages: req.flash('error'),
  });
};

/**
 * POST register
 * @route /users/register
 * @type {import('express').RequestHandler}
 */
export const httpPostRegister = async (req, res, next) => {
  try {
    // captcha
    const captchaHandle = await captcha.captchaValidation(
      req.body['g-recaptcha-response'],
      req.socket.remoteAddress
    );

    // validation
    const { fullname, email, password, confirmPassword } = req.body;
    req.body.acceptPolicy = req.body.acceptPolicy == 'on' ? true : false;
    await User.userRegisterValidation(req.body);
    await User.create({ email, password, fullname });
    res.redirect('/users/login');
  } catch (error) {
    // yup validation error
    if (error instanceof yup.ValidationError) {
      req.flash('error', error.errors);
      return res.redirect('/users/register');
    }

    // captcha error handling (CUSTOM ERROR) from (./utils/gcapthca.js)
    if (error instanceof captcha.CaptchaValidationError) {
      req.flash('error', error.message);
      return res.redirect('/users/register');
    }

    // handle other errors
    const err = new Error(error);
    err.httpStatusCode = 500;
    next(err);
  }
};

/**
 * GET forget password
 * @route /users/forget-password
 * @type {import('express').RequestHandler}
 */
export const httpGetForgetPassword = (req, res, next) => {
  res.render('auth/forgetPass', {
    pageTitle: 'Account | forget password',
    errorMessages: req.flash('error'),
  });
};

/**
 * POST forget password
 * @route /users/forget-password
 * @type {import('express').RequestHandler}
 */
export const httpPostForgetPassword = async (req, res, next) => {
  try {
    await User.userForgetValidation(req.body);
    const user = await User.findOne({ email: req.body.email });

    const token = jwt.sign({ user: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    user.resetToken = token;
    user.resetTokenExpiration = Date.now() + 3600000; // from now to 1h
    await user.save();

    transporter.sendMail({
      from: 'hamidrezarat@gmail.com',
      to: user.email,
      subject: 'ShoppingWeb Reset password link',
      html: `
        <h1>reset Password Link</h1>
        <a href="http://localhost:${PORT}/users/reset-password/${token}">LINK</a>
      `,
    });

    res.redirect('/users/forget-password');
  } catch (error) {
    // yup validation error
    if (error instanceof yup.ValidationError) {
      req.flash('error', error.errors);
      return res.redirect('/users/forget-password');
    }

    // handle other errors
    const err = new Error(error);
    err.httpStatusCode = 500;
    next(err);
  }
};

/**
 * GET reset password
 * @route /users/reset-password/:token
 * @type {import('express').RequestHandler}
 */
export const httpGetResetPassword = async (req, res, next) => {
  const token = req.params.token;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // if token is invalid (undefined) throw new error
    if (!decoded) {
      throw new jwt.JsonWebTokenError('token is invalid !');
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });

    // if token expired (Since DB expiration date) throw new error
    if (!user) {
      throw new jwt.TokenExpiredError();
    }

    res.render('auth/resetPass', {
      pageTitle: 'Account | reset password',
      user: decoded.user,
      errorMessages: req.flash('error'),
    });
  } catch (error) {
    // handle token expiration error
    if (error instanceof jwt.TokenExpiredError) {
      req.flash('error', 'token expired ! try again.');
      return res.redirect('/users/forget-password');
    }

    // handle invalid token error
    if (error instanceof jwt.JsonWebTokenError) {
      req.flash('error', 'Token is invalid ! please try again.');
      return res.redirect('/users/forget-password');
    }
  }
};

/**
 * POST reset password
 * @route /users/reset-password
 * @type {import('express').RequestHandler}
 */
export const httpPostResetPassword = async (req, res, next) => {
  try {
    const { password, userId } = req.body;

    // validation
    await User.userRestValidation(req.body);
    const user = await User.findOne({ _id: userId });
    if (!user) {
      req.flash('error', 'Something went wrong please try again !');
      return res.redirect(req.headers.referer);
    }

    // change password
    user.password = password;
    // expire token
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();
    res.redirect('/users/login');
  } catch (error) {
    // yup validation error
    if (error instanceof yup.ValidationError) {
      req.flash('error', error.errors);
      return res.redirect(req.headers.referer);
    }

    // handle other errors
    const err = new Error(error);
    err.httpStatusCode = 500;
    next(err);
  }
};

/**
 * GET logout
 * @route /users/logout
 * @type {import('express').RequestHandler}
 */
export const httpGetLogout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(err);
    }
    req.session.destroy();
    res.redirect('/');
  });
};
