'use strict'
const qiniu = require('./app/util/qiniu')

module.exports = app => {
  app.beforeStart(async() => {
    let instance = qiniu.init(app.config.qiniu)
    let { config } = instance
    config.zone = qiniu.baseQiniu.zone.Zone_z2
  });
};