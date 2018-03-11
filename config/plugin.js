'use strict';

// had enabled by egg
// exports.static = true;
exports.mongolass = {
  enable: true,
  package: 'egg-mongolass',
};

exports.io = {
  enable: true,
  package: 'egg-socket.io',
};

exports.redis = {
  enable: true,
  package: 'egg-redis',
};

exports.ejs = {
  enable: true,
  package: 'egg-view-ejs',
};

exports.alinode = {
  enable: true,
  package: 'egg-alinode',
};