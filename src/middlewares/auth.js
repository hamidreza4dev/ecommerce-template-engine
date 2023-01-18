/**
 * CHECK if user is authenticated
 * @type {import('express').RequestHandler}
 */
export const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect('/users/login');
};
