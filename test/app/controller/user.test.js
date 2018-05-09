'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/user.test.js', () => {
  let loginname;
  let email;
  let user;
  let ctx;

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
    assert(user.loginname === loginname);
  });
});
