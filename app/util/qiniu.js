'use strict'
const baseQiniu = require('qiniu')

/**
 * 暂时强行让全局使用一个单例
 */

const qiniu = function () {
  this.mac = null;
  this.config = null;
}

qiniu.prototype.init = (config) => {
  const {access_key, secret_key, bucket} = config
  this.bucket = bucket
  this.mac = new baseQiniu
    .auth
    .digest
    .Mac(access_key, secret_key)
  this.config = new baseQiniu
    .conf
    .Config();
  return this
}

let instance;

module.exports = {
  init: (config) => {
    instance = new qiniu(config)
    instance = instance.init(config)
    return instance
  },
  getInstance: () => {
    return instance
  },
  baseQiniu,
  getToken: (config) => {
    var options = {
      scope: instance.bucket
    };
    var putPolicy = new baseQiniu
      .rs
      .PutPolicy(options);
    var uploadToken = putPolicy.uploadToken(instance.mac);
    return uploadToken
  },
  getDownloadUrl: (key) => {
    const {mac, config} = instance
    const bucketManager = new baseQiniu
      .rs
      .BucketManager(mac, config)
    const publicBucketDomain = 'http://if-pbl.qiniudn.com';
    return bucketManager.publicDownloadUrl(publicBucketDomain, key);
  }
}
