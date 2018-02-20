'use strict';
const Controller = require('egg').Controller;

module.exports = class Rooms extends Controller {
  async createRoom() {
    let resCode = 200,
      message = '创建成功',
      result,
      roomId;
    const { user } = this.ctx.session;
    const { name, img, permissions } = this.ctx.request.body.data;
    const room = {
      name,
      img,
      permissions,
      owner: user._id,
      actions: [],
    };
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
  async joinRoom() {
    let resCode = 200,
      message = '创建成功',
      result;
    const { user } = this.ctx.session;
    const { logger } = this.ctx.app;
    const { queryRoom } = this.ctx.app.request.body.data;
    try {
      const room = this.service.room.getRoom(queryRoom);
      if (!room) {
        message = '房间不存在';
        resCode = 500;
      } else {
        result = this.service.partner.create({
          room: room._id,
          partner: user._id,
          status: room.permissions === 0 ? 1 : 0,
        });
      }
    } catch (e) {
      logger.error(e);
      message = '加入失败';
      resCode = 500;
    }
    this.body = {
      resCode,
      message,
    };
  }

  async updatePartnerStatus() {
    let resCode = 200,
      message = '创建成功',
      result;
    const { user } = this.ctx.session;
    const { logger } = this.ctx.app;
    const { queryRoom, status } = this.ctx.app.request.body.data;
    try {
      const room = this.service.room.getRoom(queryRoom);
      if (!room) {
        message = '房间不存在';
        resCode = 500;
      } else {
        if (room.owner_id !== user._id) {
          message = '权限不足';
          resCode = 500;
        } else {
          result = this.service.partner.updatePartnerStatus(status);
        }
      }
    } catch (e) {
      logger.error(e);
      resCode = 500;
      message = '服务器内部错误';
    }
    this.body = {
      resCode,
      message,
    };
  }
};
