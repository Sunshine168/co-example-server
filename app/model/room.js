'use strict';

const Mongolass = require('mongolass');

module.exports = app => {
  const { mongolass } = app;
  const Room = mongolass.model('Room', {
    roomNo: { type: 'number' },
    name: { type: 'string' },
    img: { type: 'string' },
    owner: { type: Mongolass.Types.ObjectId },
    permissions: { type: 'number' }, // 0 为公开 , 1为限制
    actions: { type: Mongolass.Types.array }, // 预留保存协作最后处理的一些动作
    num: { type: 'number', default: 0 },
  });

  Room.index({ roomNo: 1, _id: 1 }, { unique: true }).exec();
  return Room;
};
