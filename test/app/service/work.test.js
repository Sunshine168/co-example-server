'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('work-service-default-room', async () => {
  let ctx,
    work,
    result,
    owner,
    joiner;
  before(async () => {
    ctx = app.mockContext();
    work = ctx.service.work;
    // 暂时没有很好的办法解耦,打算通过放入启动任务里面
    await ctx.service.counter.findOrNew('room');
    owner = await ctx.service.user.findOrNew({
      account: `loginname_${Date.now()}@test.com`,
      nickname: 'nickname',
      password: 'password',
      avatar: '',
    });

    joiner = await ctx.service.user.findOrNew({
      account: `loginname_${Date.now()}@test.com`,
      nickname: 'nickname',
      password: 'password',
      avatar: '',
    });
    result = await work.createRoom({
      name: `${+new Date()}_room`,
      img: '123',
      permissions: 0,
      owner: owner._id,
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

  it('get rooms is ok', async () => {
    const rooms = await work.getRooms();
    assert.ok(rooms instanceof Array);
  });

  it('join room is ok', async () => {
    const joinResult = await work.createPartner({
      room: result.ops[0]._id,
      partner: joiner._id,
      join: result.ops[0] === 0 ? 1 : 0,
    });
    assert.equal(joinResult.result.ok, 1);

    const rooms = await work.getPartnerRooms(joiner._id);

    assert.ok(rooms instanceof Array);

    const partners = await work.getPartners(result.ops[0]._id);

    const matchPartner = partners.find(
      partner => partner._id + '' === joiner._id + ''
    );

    assert.ok(matchPartner);

    const queryPartnerRecord = await work.queryPartner({
      partner: joiner._id,
    });

    assert.equal(queryPartnerRecord.partner + '', joiner._id + '');
  });

  after(async () => {
    await work.deleteRoomRecord({ _id: result.ops[0]._id });
  });
});
