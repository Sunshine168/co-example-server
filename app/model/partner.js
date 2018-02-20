'use strict';

const Mongolass = require('mongolass');

module.exports = app => {
  const { mongolass } = app;
  const Partner = mongolass.model('Partner', {
    room: { type: Mongolass.Types.ObjectId },
    partner: { type: Mongolass.Types.ObjectId },
    stauts: { type: 'number' }, // 状态 0 待审核,1核准, 拒绝为2  房间如果是公开 自动为1
  });

  Partner.index({ room: 1, partner: 1 }, { unique: true }).exec();
  return Partner;
};
