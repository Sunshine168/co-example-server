'use strict';

const Controller = require('egg').Controller;

class InitHelperController extends Controller {
  // 只是方便快速浏览效果的时候的帮助接口
  async autoIncrementSequenceHelper() {
    let resCode = 200,
      message = '初始化counter成功';
    try {
      await this.service.counter.create({
        _id: 'room',
        sequenceValue: 1000,
      });
    } catch (e) {
      this.ctx.logger.error(e);
      resCode = 500;
      message = '初始化失败';
    }
    this.ctx.body = {
      resCode,
      message,
    };
  }
}

module.exports = InitHelperController;
