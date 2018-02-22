'use strict';

const Service = require('egg').Service;

class WorkService extends Service {
  async createRoom(room) {
    const roomId = await this.service.counter.counterHelper('room');
    const tempRoom = Object.assign(room, {
      roomNo: roomId,
      permissions: parseInt(room.permissions),
    });
    return this.app.model.Room.create(tempRoom).exec();
  }

  async createPartner(partner) {
    return this.app.model.Partner.create(partner).exec();
  }

  // 按创建时间降序获取某个用户创建的所有房间
  getRooms(owner) {
    return this.app.model.Room.find({ owner })
      .populate({
        path: 'owner',
        model: 'User',
        select: {
          password: 0,
        },
      })
      .sort({ _id: -1 })
      .exec();
  }

  // 按创建时间降序获取某个用户名下的所有房间
  getPartnerRooms(partner) {
    return this.app.model.Partner.find({ partner })
      .populate({
        path: 'room',
        model: 'Room',
      })
      .sort({ _id: -1 })
      .exec();
  }

  queryPartner(partner) {
    return this.app.model.Partner.findOne(partner).exec();
  }

  getRoom(room) {
    if (room.roomNo && typeof room.roomNo === 'string') {
      room.roomNo = parseInt(room.roomNo);
    }
    return this.app.model.Room.findOne(room).exec();
  }

  delRoom(room) {
    return this.app.Room.remove({ room }).exec();
  }
}

module.exports = WorkService;
