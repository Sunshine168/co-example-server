'use strict';

module.exports = app => {
  const { mongolass } = app;
  const User = mongolass.model('User', {
    account: { type: 'string' },
    password: { type: 'string' },
    avatar: { type: 'string' },
    nickname: { type: 'string' },
  });
  User.plugin('safyMode', {
    afterFindOne(user) {
      if (user) {
        return {
          account: user.account,
          nickname: user.nickname,
          avatar: user.avatar,
          _id: user._id,
        };
      }
    },
  });
  User.index({ account: 1 }, { unique: true }).exec();
  return User;
};
