'use strict';

module.exports = app => {
  const { mongolass } = app;
  const User = mongolass.model('User', {
    account: { type: 'string' },
    name: { type: 'string' },
  });

  User.index({ account: 1 }, { unique: true }).exec();
  return User;
};
