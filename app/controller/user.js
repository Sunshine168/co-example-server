'use strict';
const crypto = require('crypto');
const Controller = require('egg').Controller;

const formidablePromise = require('../util/form-helper');

class UserController extends Controller {
  async signIn() {
    let resCode = 200,
      message = '登录成功',
      user;
    let { account, password } = this.ctx.request.body;
    if (this.ctx.session.user) {
      message = '请勿重复登录';
      resCode = 401;
    } else {
      try {
        user = await this.ctx.service.user.getUserAccount(account);
        password = crypto
          .createHash('md5')
          .update(password)
          .digest('hex');
        if (user && user.password === password) {
          delete user.password;
          this.ctx.session.user = user;
        } else {
          throw new Error('账户不存在或密码不正确');
        }
      } catch (e) {
        resCode = 500;
      }
    }
    this.ctx.response.body = {
      resCode,
      message,
      user,
    };
  }

  async signUp() {
    const ctx = this.ctx;
    try {
      const form = await formidablePromise(ctx.req);
       
    } catch (e) {
      //
    }
  }
}

module.exports = UserController;
