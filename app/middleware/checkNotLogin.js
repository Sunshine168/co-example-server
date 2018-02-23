'use strict';

// 检查登录状态,如果已经登录则返回403
async function checkNotLogin(ctx, next) {
  if (ctx.session.user) {
    ctx.body = {
      resCode: 403,
      message: '请勿重复登录',
    };
    return;
  }
  await next();
}

module.exports = checkNotLogin;
