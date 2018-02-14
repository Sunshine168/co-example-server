'use strict';

const Service = require('egg').Service;

class UserService extends Service {
  create(user) {
    return this.app.model.User.create(user).exec();
  }

  getUserByAccount(account) {
    return this.app.model.User.findOne({ account })
      .addCreatedAt()
      .exec();
  }

  getUserById(id) {
    return this.app.model.User.findOne({ _id: id })
      .safyMode()
      .exec();
  }
}

module.exports = UserService;
