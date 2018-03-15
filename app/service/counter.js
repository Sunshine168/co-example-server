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

  findCounter(name) {
    return this.ctx.model.Counter.findOne({ _id: name }).exec();
  }

  async findOrNew(name) {
    const findingCounter = await this.findCounter(name);
    if (findingCounter) {
      return this.findCounter;
    }
    const result = await this.create({
      _id: name,
      sequenceValue: 1000,
    });
    return result.ops[0];
  }
}

module.exports = CounterService;
