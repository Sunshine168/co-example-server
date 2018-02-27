'use strict';

const Mongolass = require('mongolass');

module.exports = app => {
  const { mongolass } = app;
  const Partner = mongolass.model('Partner', {
    room: { type: Mongolass.Types.ObjectId },
    join: { type: 'number' }, // -1彻底拉黑, 0待通过, 1已通过, 2拒绝
    partner: { type: Mongolass.Types.ObjectId },
  });

  Partner.index({ room: 1, partner: 1 }, { unique: true }).exec();
  return Partner;
};
