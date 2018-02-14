'use strict';

module.exports = appInfo => {
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1515330142276_4216';

  // add your config here
  config.middleware = [];

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
