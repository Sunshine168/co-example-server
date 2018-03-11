"use strict";
const path = require("path");

module.exports = appInfo => {
  const dir = [
    path.join(appInfo.baseDir, "/app/public"),
    path.join(appInfo.baseDir, "/app/upload")
  ];

  return {
    mongolass: {
      app: true,
      client: {
        host: "127.0.0.1",
        port: "27017",
        database: "co-work",
        customPlugins: true
      }
    },
    redis: {
      client: {
        host: "127.0.0.1",
        port: 6379,
        password: "",
        db: "0"
      }
    },
    io: {
      namespace: {
        "/": {
          connectionMiddleware: ["auth"],
          packetMiddleware: [] // 针对消息的处理暂时不实现
        }
      },
      // cluster 模式下，通过 redis 实现数据共享
      redis: {
        host: "127.0.0.1",
        port: 6379
      }
    },
    static: {
      dir
    },
    view: {
      defaultExt: ".html",
      mapping: {
        ".ejs": "ejs",
        ".html": "ejs"
      }
    },
    alinode: {
      // 从 `Node.js 性能平台` 获取对应的接入参数
      appid: "2373",
      secret: "68953b2262c88b34566db81bef4ae62c598eb0e8"
    }
  };
};
