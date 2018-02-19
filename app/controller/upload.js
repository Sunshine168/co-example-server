'use strict';
const path = require('path');
const sendToWormhole = require('stream-wormhole');
const toArray = require('stream-to-array');
const Controller = require('egg').Controller;
const fs = require('fs');
const uuidV4 = require('uuid/v4');

module.exports = class UploadController extends Controller {
  async upload() {
    const ctx = this.ctx;
    const stream = await ctx.getFileStream();
    const fileName = uuidV4().replace(/-/g, ''),
      // 组合出本地存储图片的路径
      avatarPath = path.join(
        this.config.baseDir,
        `upload/avatar/${fileName}.png`
      );
    let buf;
    // 组合出存储到数据库的路径
    try {
      // process file or upload to cloud storage
      const parts = await toArray(stream);
      buf = Buffer.concat(parts);
      fs.writeFileSync(avatarPath, buf);
    } catch (err) {
      // must consume the stream, otherwise browser will be stuck.
      await sendToWormhole(stream);
      throw err;
    }

    ctx.body = {
      url: avatarPath,
      fields: stream.fields,
    };
  }
};
