'use strict';

const Mongolass = require('mongolass');

module.exports = app => {
  const { mongolass } = app;
  const Partner = mongolass.model('Partner', {
    room: { type: Mongolass.Types.ObjectId },
    join: { type: 'number' },
    partner: { type: Mongolass.Types.ObjectId },
  });

  Partner.index({ room: 1, partner: 1 }, { unique: true }).exec();
  return Partner;
};
