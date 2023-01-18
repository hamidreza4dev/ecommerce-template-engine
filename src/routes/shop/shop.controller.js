/**
 * GET Shop index
 * @route /
 * @type {import('express').RequestHandler}
 */
export const httpGetIndex = (req, res, next) => {
  res.render('shop/index', {
    pageTitle: 'our Shop',
  });
};
