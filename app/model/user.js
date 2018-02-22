'use strict';

module.exports = app => {
  const { mongolass } = app;
  const User = mongolass.model('User', {
    account: { type: 'string' },
    password: { type: 'string' },
    avatar: { type: 'string' },
    nickname: { type: 'string' },
  });

  User.index({ account: 1 }, { unique: true }).exec();
  return User;
};
