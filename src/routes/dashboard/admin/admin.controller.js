/**
 * GET admin index
 * @route /dashboard
 * @type {import('express').RequestHandler}
 */
export const httpGetIndex = (req, res, next) => {
  res.render('dashboard/admin/main', {
    pageTitle: 'Admin | main',
  });
};

/**
 * GET products
 * @route /dashboard/products
 * @type {import('express').RequestHandler}
 */
export const httpGetProducts = (req, res, next) => {
  res.render('dashboard/admin/products', {
    pageTitle: 'Admin | products',
    products: [],
  });
};
