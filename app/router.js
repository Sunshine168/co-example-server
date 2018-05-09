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
  router.post(
    '/workspace/deleteRoom/:roomId',
    checkLogin,
    controller.room.deleteRoom
  );
  router.post(
    '/workspace/updatePartnerStatus',
    checkLogin,
    controller.room.updatePartnerStatus
  );
  router.post(
    '/workspace/:roomId/partners',
    checkLogin,
    controller.room.getPartners
  );
  router.post(
    '/helper/init-counter',
    controller.initHelperController.autoIncrementSequenceHelper
  );
  router.post(
    '/workspace/:roomNo/checkAlive',
    checkLogin,
    controller.room.checkRoomAlive
  );
  router.post(
    '/workspace/:roomNo/quitRoom',
    checkLogin,
    controller.room.quitRoom
  );
  router.post(
    '/workspace/:roomNo/update',
    checkLogin,
    controller.room.updateRoom
  );
  router.post('/signOut', controller.user.signOut);
  io.of('/').route('exchange', io.controller.nsp.exchange);
};
