'use strict';

module.exports = {
  security: {
    csrf: {
      enable: false,
    },
  },
  mongolass: {
    app: true,
    client: {
      host: '127.0.0.1',
      port: '27017',
      database: 'co-work',
      customPlugins: true,
    },
  },
  io: {
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
  },
};
