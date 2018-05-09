'use strict';
const path = require('path');
const sendToWormhole = require('stream-wormhole');
const toArray = require('stream-to-array');
const Controller = require('egg').Controller;
const fs = require('fs');
const uuidV4 = require('uuid/v4');

const qiniu = require('../util/qiniu');

module.exports = class UploadController extends Controller {
  // 从简,上传图片的接口是公开的api ,正确不应该这样设计,而且上传云是最好的。
  async upload() {
    let url;
    const ctx = this.ctx;
    const stream = await ctx.getFileStream();
    const fileName = uuidV4().replace(/-/g, '');
    const { baseQiniu, getInstance, getToken } = qiniu;
    const instance = getInstance();
    const formUploader = new baseQiniu.form_up.FormUploader(instance.config);
    const putExtra = new baseQiniu.form_up.PutExtra();
    const uplodPromise = () => {
      return new Promise((resolve, reject) => {
        formUploader.putStream(getToken(), fileName, stream, putExtra, function(
          respErr,
          respBody,
          respInfo
        ) {
          if (respErr) {
            throw respErr;
          }
          if (respInfo.statusCode === 200) {
            resolve(respBody);
          } else {
            reject(respBody);
          }
        });
      });
    };
    // 组合出存储到数据库的路径
    try {
      const res = await uplodPromise();
      url = `http://orscxqn8h.bkt.clouddn.com/${fileName}`;
    } catch (err) {
      // must consume the stream, otherwise browser will be stuck.
      await sendToWormhole(stream);
      throw err;
    }

    ctx.body = {
      url,
      // fields: stream.fields
    };
  }
};
