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
};
