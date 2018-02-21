'use strict';

const Service = require('egg').Service;

class CounterService extends Service {
  async counterHelper(name) {
    console.log(name);
    const ret = await this.ctx.model.Counter.findAndModify({
      query: { _id: name },
      update: { $inc: { sequenceValue: 1 } },
      new: true,
    }).exec();
    return ret.next;
  }
  create(counter) {
    return this.ctx.model.Counter.create(counter).exec();
  }
}

module.exports = CounterService;
