'use strict';
const crypto = require('crypto');
const Controller = require('egg').Controller;
const uuidV4 = require('uuid/v4');
const defaultAvatar = './';

class UserController extends Controller {
  async signIn() {
    let resCode = 200,
      message = '登录成功',
      user;
    let { account, password } = this.ctx.request.body.data;
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

    this.ctx.body = {
      resCode,
      message,
      data: user,
    };
  }

  async signUp() {
    let resCode = 200,
      message = '注册成功';
    try {
      console.log(this.ctx.request.body);
      let { account, nickname, password, avatar } = this.ctx.request.body.data;
      password = crypto
        .createHash('md5')
        .update(password)
        .digest('hex');
      const user = {
        account,
        nickname,
        password,
        avatar,
      };
      await this.ctx.service.user.create(user);
    } catch (e) {
      //
      if (e.message.match('E11000 duplicate key')) {
        resCode = 500;
        message = '用户名已被占用';
      } else {
        resCode = 500;
        message = '服务器内部错误';
      }
    }
    this.ctx.body = {
      resCode,
      message,
    };
  }

  async workspaceInfo() {
    let resCode = 200,
      message = '',
      rooms = [];
    const user = this.ctx.session.user;
    try {
      // 获取工作空间需要的所有信息
      const ownerRooms = await this.service.work.getRooms(user._id);
      const partners = await this.service.work.getPartnerRooms(user._id);
      const partnerRooms = partners.map(partner => partner.room);
      this.ctx.logger.debug('get rooms', ownerRooms, partnerRooms);
      if (Array.isArray(ownerRooms)) {
        rooms = rooms.concat(
          ownerRooms.map(room => ({
            ...room,
            isOwner: true,
          }))
        );
      }
      if (Array.isArray(partnerRooms)) {
        rooms = rooms.concat(partnerRooms);
      }
    } catch (e) {
      this.ctx.logger.error(e);
      message = '服务器内部错误';
      resCode = 500;
    }
    this.ctx.body = {
      resCode,
      message,
      data: {
        rooms,
      },
    };
  }

  async signOut() {
    this.ctx.session.user = null;
    this.ctx.body = {
      resCode: 200,
    };
  }
}

module.exports = UserController;
