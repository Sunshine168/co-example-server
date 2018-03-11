'use strict';
const path = require('path');

module.exports = appInfo => {
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1515330142276_4216';

  // // add your config here
  config.middleware = [ 'historyFallback' ];

  const dir = [
    path.join(appInfo.baseDir, '/app/public'),
    path.join(appInfo.baseDir, '/app/upload'),
  ];
  config.static = {
    dir,
  };
  return config;
};

exports.mongolass = {
  app: true,
  client: {
    host: '127.0.0.1',
    port: '27017',
    database: 'co-work',
    customPlugins: true,
  },
};

exports.redis = {
  client: {
    host: '127.0.0.1',
    port: 6379,
    password: '',
    db: '0',
  },
};

exports.io = {
  namespace: {
    '/': {
      connectionMiddleware: [ 'auth' ],
      packetMiddleware: [], // 针对消息的处理暂时不实现
    },
  },
  // cluster 模式下，通过 redis 实现数据共享
  redis: {
    host: '127.0.0.1',
    port: 6379,
  },
};

exports.view = {
  defaultExt: '.html',
  mapping: {
    '.ejs': 'ejs',
    '.html': 'ejs',
  },
};
