'use strict';

module.exports = app => {
  const { mongolass } = app;
  const User = mongolass.model('User', {
    account: { type: 'string' },
    name: { type: 'string' },
    password: { type: 'string' },
    avatar: { type: 'string' },
    gender: { type: 'string', enum: [ '0', '1', '2' ] }, // 0 女性 1男性 2不明
    bio: { type: 'string' },
  });

  User.index({ account: 1 }, { unique: true }).exec();
  return User;
};
