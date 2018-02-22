'use strict';

const Service = require('egg').Service;

class CounterService extends Service {
  async counterHelper(name) {
    const ret = await this.ctx.model.Counter.findAndModify(
      { _id: name },
      [],
      {
        $inc: { sequenceValue: 1 },
      },
      { new: true }
    ).exec();
    return ret.value.sequenceValue;
  }
  create(counter) {
    return this.ctx.model.Counter.create(counter).exec();
  }
}

module.exports = CounterService;
