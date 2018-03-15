'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('user-service', async () => {
  let ctx,
    user,
    result,
    account;
  before(async () => {
    ctx = app.mockContext();
    user = ctx.service.user;
    const accountFreix = `loginname_${Date.now()}`;
    account = accountFreix + '@test.com';
    result = await user.findOrNew({
      account,
      nickname: 'nickname',
      password: 'password',
      avatar: '',
    });
  });

  it('create user success', async () => {
    assert.ok(result);
  });

  it('getUserByAccount should work well', async () => {
    const findingUser = await user.getUserByAccount(account);
    assert.equal(findingUser.account, account);
  });

  it('getUserById should work well', async () => {
    const findingUser = await user.getUserById(result._id);
    assert.equal(findingUser._id + '', result._id + '');
  });
});
