'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.post('/signUp', controller.user.signUp);
  router.post('/signIn', controller.user.signIn);
};
