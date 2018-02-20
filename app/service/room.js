'use strict';

const Service = require('egg').Service;

class RoomService extends Service {
  create(room) {
    return this.app.model.Room.create(room).exec();
  }
  // 按创建时间降序获取某个用户名下的所有房间
  getRooms(owner) {
    return this.app.model.Room.find({ owner })
      .sort({ _id: -1 })
      .exec();
  }

  getRoom(roomInfo) {
    return this.app.model.Room.findOne({ roomInfo })
      .exec();
  }

  delRoom(room) {
    return this.app.Room.remove({ room }).exec();
  }
}

module.export = RoomService;
