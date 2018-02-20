'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, io, middleware } = app;
  const { checkLogin, checkNotLogin } = middleware;
  router.get('/', controller.home.index);
  router.post('/signUp', checkNotLogin, controller.user.signUp);
  router.post('/signIn', controller.user.signIn);
  router.post('/upload', controller.upload.upload);
  router.post('/workspace/createRoom', checkLogin, controller.room.createRoom);
  router.post('/workspace/joinRoom', checkLogin, controller.room.joinRoom);
  router.post('/workspace/info', checkLogin, controller.user.workspaceInfo);
  io.of('/').route('exchange', io.controller.nsp.exchange);
};
