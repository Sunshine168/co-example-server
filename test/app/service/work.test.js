'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('work-service-default-room', async () => {
  let ctx,
    work,
    result,
    user;
  before(async () => {
    ctx = app.mockContext();
    work = ctx.service.work;
    const accountFreix = `loginname_${Date.now()}`;
    const account = accountFreix + '@test.com';
    // 暂时没有很好的办法解耦,打算通过放入启动任务里面
    await ctx.service.counter.findOrNew('room');
    user = await ctx.service.user.findOrNew({
      account,
      nickname: 'nickname',
      password: 'password',
      avatar: '',
    });
    result = await work.createRoom({
      name: `${+new Date()}_room`,
      img: '123',
      permissions: 1,
      owner: user._id,
      actions: [],
    });
  });

  it('create room is ok', async () => {
    assert.equal(result.result.ok, 1);
  });

  it('get room is ok', async () => {
    const room = await work.getRoom({ _id: result.ops[0]._id });
    assert.equal(room._id + '', result.ops[0]._id + '');
  });

  after(async () => {
    await work.deleteRoomRecord({ _id: result.ops[0]._id });
  });
});
