'use strict';

const Controller = require('egg').Controller;
const PREFIX = 'room';

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
      result = await this.service.work.createRoom(room);
      roomId = result.ops[0].roomNo;
      logger.debug('#room create', roomId);
      this.app.redis.set(`${PREFIX}:${roomId}`, result.ops[0]._id);
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

  // 结构不是很合理,关于用户行为错误是不是也应该抛出异常,根据异常类型进行记录？
  async joinRoom() {
    let resCode = 200,
      message = '加入申请已发送',
      result;
    const { user } = this.ctx.session;
    const { logger } = this.ctx.app;
    const queryRoom = this.ctx.request.body.data;
    try {
      const room = await this.service.work.getRoom(queryRoom);
      if (!room) {
        message = '房间不存在';
        resCode = 500;
      } else {
        // 加入房间前必须判断该用户不是房主, 不在参与者里, 或者参与状态为2
        if (room.owner._id === user._id) {
          message = '你已经是房主,请勿重复加入';
          resCode = 500;
        } else {
          const partnerRecord = await this.service.work.queryPartner({
            room: room._id,
            partner: user._id,
          });
          if (!partnerRecord) {
            result = await this.service.work.createPartner({
              room: room._id,
              partner: user._id,
              join: room.permissions === 0 ? 1 : 0,
            });
            message = '加入成功';
          } else {
            // 只有需要审核才会进入到这一步
            if (partnerRecord.join === 2) {
              await this.service.partner.updatePartnerStauts(
                partnerRecord._id,
                0
              );
            }
            if (partnerRecord.join === 1) {
              message = '请勿重复加入';
              resCode = 500;
            }
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
      data: {
        message,
        status: result && result.result.ok ? result.ops[0].join : null,
      },
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
      const room = await this.service.work.getRoom(queryRoom);
      if (!room) {
        message = '房间不存在';
        resCode = 500;
      } else {
        if (room.owner + '' !== user._id) {
          message = '权限不足';
          resCode = 500;
        } else {
          result = await this.service.work.updatePartnerStatus(
            user._id,
            room._id,
            status
          );
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
      const room = await this.service.work.getRoom({
        roomNo: roomId,
      });
      if (!room) {
        message = '房间不存在';
        resCode = 500;
      } else {
        if (room.owner + '' !== user._id) {
          message = '权限不足';
          resCode = 500;
        } else {
          result = await this.service.work.getPartners(room._id);
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

  async deleteRoom() {
    let resCode = 200,
      message = '删除成功',
      room;
    const { logger } = this.ctx.app;
    const { user } = this.ctx.session;
    const { roomId } = this.ctx.params;
    try {
      room = await this.service.work.getRoom({
        roomNo: roomId,
      });
      if (!room) {
        message = '房间不存在';
        resCode = 500;
      } else {
        if (room.owner + '' !== user._id) {
          message = '权限不足';
          resCode = 500;
        } else {
          const result = await this.service.work.deleteRoomRecord(room);
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

  async quitRoom() {
    let resCode = 500,
      message = '退出失败',
      room;
    const { logger } = this.ctx.app;
    const { user } = this.ctx.session;
    const { roomNo } = this.ctx.params;
    try {
      room = await this.service.work.getRoom({
        roomNo,
      });
      if (!room) {
        message = '房间不存在';
      } else {
        const res = await this.service.work.deletePartner({
          partner: user._id,
          room: room._id,
        });
        if (res.result.ok && res.result.n === 1) {
          resCode = 200;
          message = '退出成功';
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

  async checkRoomAlive() {
    let resCode = 500,
      message = '房间不存在',
      room;
    const { roomNo } = this.ctx.params;
    const userId = this.ctx.session.user._id;
    try {
      const result = await this.ctx.app.redis.get(`room:${roomNo}`);
      if (result) {
        // 检查用户是否有权限加入房间
        const queryRecord = await this.ctx.service.work.queryPartner({
          room: result,
          partner: userId,
        });
        if (queryRecord) {
          resCode = 200;
          message = '获取房间成功';
        } else {
          room = await this.ctx.service.work.getRoom({
            _id: result,
          });
          // 需要先转换成string
          if (room.owner + '' === userId) {
            resCode = 200;
            message = '获取房间成功';
          }
        }
      }
    } catch (e) {
      this.ctx.logger.error(e);
    }
    this.ctx.body = {
      resCode,
      message,
      data: {
        room,
      },
    };
  }
};
