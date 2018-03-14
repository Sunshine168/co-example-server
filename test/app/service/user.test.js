'use strict';

const { app, assert } = require('egg-mock/bootstrap');
const mm = require('egg-mock');

const account = '12345@test.com';
const nickname = 'test';
const password = '123132123';
const avatar = '';

describe('test-work', async () => {
  let ctx,
    user,
    result;
  before(async () => {
    ctx = app.mockContext();
    user = ctx.service.user;
    result = await user.create({
      account,
      nickname,
      password,
      avatar,
    });
  });

  it('create user success', async () => {
    assert.equal(result.result.ok, 1);
  });

  it('getUserByAccount should work well', async () => {
    const findingUser = await user.getUserByAccount(account);
    assert.equal(findingUser.account, account);
  });

  it('getUserById should work well', async () => {
    const findingUser = await user.getUserById(result.ops[0]._id);
    assert.equal(findingUser._id + '', result.ops[0]._id + '');
  });

  after(async () => {
    await user.remove({ account });
  });
});
