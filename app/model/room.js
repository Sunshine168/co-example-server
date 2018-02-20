'use strict';

const Mongolass = require('mongolass');

module.exports = app => {
  const { mongolass } = app;
  const Room = mongolass.model('Room', {
    room: { type: 'string' },
    name: { type: 'string' },
    img: { type: 'string' },
    owner: { type: Mongolass.Types.ObjectId },
  });

  Room.index({ room: 1 }, { unique: true }).exec();
  return Room;
};
