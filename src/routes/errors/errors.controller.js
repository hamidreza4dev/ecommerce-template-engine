/**
 * GET 500 page
 * @route /500
 * @type {import('express').RequestHandler}
 */
export const httpGet500 = (req, res, next) => {
  res.render('errors/500', {
    pageTitle: '500 | internal server error',
  });
};

/**
 * GET 404 page
 * @route /404
 * @type {import('express').RequestHandler}
 */
export const httpGet404 = (req, res, next) => {
  res.render('errors/404', {
    pageTitle: '404 | Page Not Found',
  });
};
