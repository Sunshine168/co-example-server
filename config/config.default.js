'use strict';

module.exports = appInfo => {
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1515330105276_2316';

  // add your config here
  config.middleware = [];

  return config;
};

exports.mongolass = {
  client: {
    host: 'localhost',
    port: '27017',
    database: 'blog',
  },
};
