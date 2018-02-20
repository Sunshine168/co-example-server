'use strict';
const Controller = require('egg').Controller;

module.exports = class Rooms extends Controller {
  async createRoom(data) {
    let resCode = 200,
      message = '创建成功',
      result,
      roomId;
    const { user } = this.ctx.session;
    const room = Object.assign({ owner: user._id }, data);
    const { logger } = this.ctx.app;
    try {
      result = await this.service.room.create(room);
      roomId = result.ops[0]._id;
      logger.debug('#room create', roomId);
      this.app.radis.set(roomId, result.ops[0]);
    } catch (e) {
      logger.error(e);
      resCode = 500;
      message = '创建失败';
    }
    this.body = {
      resCode,
      message,
      data: {
        room: result.ops[0],
      },
    };
  }
};
