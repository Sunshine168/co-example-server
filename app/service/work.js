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

  // 按创建时间降序获取某个用户参加的所有房间
  getPartnerRooms(partner) {
    return this.app.model.Partner.find({ partner })
      .populate({
        path: 'room',
        model: 'Room',
      })
      .sort({ _id: -1 })
      .exec();
  }

  // 获取某一房间所有没有被拒绝的参与者
  async getPartners(room) {
    const partners = await this.app.model.Partner.find({
      room,
      join: { $ne: -1 },
    })
      .populate({
        path: 'partner',
        model: 'User',
        select: {
          password: 0,
        },
      })
      .exec();
    return partners.map(partner => partner.partner);
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

  deleteRoom(room) {
    return this.app.model.Room.remove(room).exec();
  }

  deletePartner(partner) {
    return this.app.model.Partner.remove(partner).exec();
  }

  updatePartnerStatus(userId, roomId, status) {
    return this.app.model.Partner.update(
      {
        room: roomId,
        partner: userId,
      },
      { $set: { status } }
    );
  }

  deleteRoomRecord(room) {
    return Promise.all([
      this.app.model.Room.remove(room).exec(),
      this.deletePartner({ room: room._id }),
    ]);
  }
}

module.exports = WorkService;
