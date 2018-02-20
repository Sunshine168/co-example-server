'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, io } = app;
  router.get('/', controller.home.index);
  router.post('/signUp', controller.user.signUp);
  router.post('/signIn', controller.user.signIn);
  router.post('/upload', controller.upload.upload);

  io.of('/').route('exchange', io.controller.nsp.exchange);
};
