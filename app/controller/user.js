'use strict';
const crypto = require('crypto');
const Controller = require('egg').Controller;
const uuidV4 = require('uuid/v4');

const formidablePromise = require('../util/form-helper');

class UserController extends Controller {
  async signIn() {
    let resCode = 200,
      message = '登录成功',
      user;
    let { account, password } = this.ctx.request.body.data;
    if (this.ctx.session.user) {
      message = '请勿重复登录';
      resCode = 401;
    } else {
      try {
        user = await this.ctx.service.user.getUserByAccount(account);
        password = crypto
          .createHash('md5')
          .update(password)
          .digest('hex');
        if (user && user.password === password) {
          delete user.password;
          this.ctx.session.user = user;
          // 调用 rotateCsrfSecret 刷新用户的 CSRF token
          this.ctx.rotateCsrfSecret();
        } else {
          throw new Error('账户不存在或密码不正确');
        }
      } catch (e) {
        resCode = 500;
        message = e.message;
      }
    }
    this.ctx.response.body = {
      resCode,
      message,
      user,
    };
  }

  async signUp() {
    try {
      let {
        account,
        username,
        gender,
        bio,
        password,
        pic,
      } = this.ctx.request.body.data;
      password = crypto
        .createHash('md5')
        .update(password)
        .digest('hex');
      const user = {
        account,
        name: username,
        password,
        gender,
        bio,
      };
      await this.ctx.service.user.create(user);
    } catch (e) {
      //
      console.log(e);
    }
  }
}

module.exports = UserController;
