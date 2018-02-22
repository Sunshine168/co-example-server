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
      result = await this.service.work.create(room);
      roomId = result.ops[0].roomNo;
      logger.debug('#room create', roomId);
      this.app.redis.set(roomId, result.ops[0]);
    } catch (e) {
      logger.error(e);
      resCode = 500;
      message = '创建失败';
    }
    this.ctx.body = {
      resCode,
      message,
      data: {
        room: roomId,
      },
    };
  }
  async joinRoom() {
    let resCode = 200,
      message = '加入申请已发送',
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
        // 加入房间前必须判断该用户不是房主, 不在参与者里, 或者参与状态为2
        if (room.owner._id === user._id) {
          message = '你已经是房主,请勿重复加入';
          resCode = 500;
        } else {
          const partnerRecord = this.service.partner.queryPartner({
            room: room._id,
            partner: user._id,
          });
          if (!partnerRecord) {
            result = await this.service.partner.create({
              room: room._id,
              partner: user._id,
              status: room.permissions === 0 ? 1 : 0,
            });
          } else {
            if (partnerRecord.status === 2) {
              this.service.partner.updatePartnerStauts(partnerRecord._id, 0);
            }
          }
          if (partnerRecord.status === 1) {
            message = '请勿重复加入';
            resCode = 500;
          }
        }
      }
    } catch (e) {
      logger.error(e);
      message = '加入申请发送失败';
      resCode = 500;
    }
    this.ctx.body = {
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
      const room = await this.service.room.getRoom(queryRoom);
      if (!room) {
        message = '房间不存在';
        resCode = 500;
      } else {
        if (room.owner_id !== user._id) {
          message = '权限不足';
          resCode = 500;
        } else {
          result = await this.service.partner.updatePartnerStatus(status);
        }
      }
    } catch (e) {
      logger.error(e);
      resCode = 500;
      message = '服务器内部错误';
    }
    this.ctx.body = {
      resCode,
      message,
    };
  }
  async getPartners() {
    let resCode = 200,
      message = '创建成功',
      result;
    const { user } = this.ctx.session;
    const { logger } = this.ctx.app;
    const { roomId } = this.ctx.params;
    try {
      const room = await this.service.room.getRoom({
        room: roomId,
      });
      if (!room) {
        message = '房间不存在';
        resCode = 500;
      } else {
        if (room.owner_id !== user._id) {
          message = '权限不足';
          resCode = 500;
        } else {
          result = await this.service.partner.getPartners(roomId);
        }
      }
    } catch (e) {
      logger.error(e);
      resCode = 500;
      message = '服务器内部错误';
    }
    this.ctx.body = {
      resCode,
      message,
      data: {
        result,
      },
    };
  }
};
