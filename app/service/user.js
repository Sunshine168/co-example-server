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

  remove(user) {
    return this.app.model.User.remove(user).exec();
  }

  async findOrNew(user) {
    const findingUser = await this.getUserByAccount(user.account);
    if (findingUser) {
      return findingUser;
    }
    const result = await this.create(user);
    return result.ops[0];
  }
}

module.exports = UserService;
