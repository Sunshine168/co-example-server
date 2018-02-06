'use strict';

const moment = require('moment');
const objectIdToTimestamp = require('objectid-to-timestamp');

module.exports = app => {
  const { mongolass } = app;
  mongolass.plugin('addCreatedAt', {
    afterFind(results) {
      results.forEach(function(item) {
        item.created_at = moment(objectIdToTimestamp(item._id)).format(
          'YYYY-MM-DD HH:mm'
        );
      });
      return results;
    },
    afterFindOne(result) {
      if (result) {
        result.created_at = moment(objectIdToTimestamp(result._id)).format(
          'YYYY-MM-DD HH:mm'
        );
      }
      return result;
    },
  });
  const User = mongolass.model('User', {
    account: { type: 'string' },
    name: { type: 'string' },
  });

  User.index({ account: 1 }, { unique: true }).exec();
  return User;
};
