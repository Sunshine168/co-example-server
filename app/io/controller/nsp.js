'use strict';

const Controller = require('egg').Controller;

class NspController extends Controller {
  async exchange() {
    const { ctx, app } = this;
    const nsp = app.io.of('/');
    const message = ctx.args[0] || {};
    const socket = ctx.socket;
    const client = socket.id;

    try {
      const { target, payload } = message;
      if (!target || typeof target !== 'string') return;
      const msg = ctx.helper.parseMsg('exchange', payload, { client, target });
      if (target.startsWith('room_')) {
        const roomNo = target.slice(5);
        nsp.to(roomNo).emit(roomNo, msg);
      } else {
        nsp.emit(target, msg);
      }
    } catch (error) {
      app.logger.error(error);
    }
  }
}

module.exports = NspController;
