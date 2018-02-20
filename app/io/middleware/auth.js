'use strict';
const PREFIX = 'room';

module.exports = () => {
  return async (ctx, next) => {
    const { app, socket, logger, helper } = ctx;
    const id = socket.id;
    const nsp = app.io.of('/');
    const query = socket.handshake.query;

    // 用户信息
    const { room, userId } = query;
    const rooms = [ room ];

    logger.debug('#user_info', id, room, userId);

    const tick = (id, msg) => {
      logger.debug('#tick', id, msg);

      // 踢出用户前发送消息
      socket.emit(id, helper.parseMsg('deny', msg));

      // 调用 adapter 方法踢出用户，客户端触发 disconnect 事件
      nsp.adapter.remoteDisconnect(id, true, err => {
        logger.error(err);
      });
    };

    // 检查房间是否存在，不存在则踢出用户
    // 备注：此处 app.redis 与插件无关，可用其他存储代替
    const hasRoom = await app.redis.get(`${PREFIX}:${room}`);

    logger.debug('#has_exist', hasRoom);

    if (!hasRoom) {
      tick(id, {
        type: 'deleted',
        message: 'deleted, room has been deleted.',
      });
      return;
    }

    // 当用户加入时
    nsp.adapter.clients(rooms, (err, clients) => {
      // 追加当前 socket 信息到clients
      clients[id] = query;

      // 加入房间
      socket.join(room);

      logger.debug('#online_join', _clients);

      // 更新在线用户列表
      nsp.to(room).emit('online', {
        clients,
        action: 'join',
        target: 'participator',
        message: `User(${id}) joined.`,
      });
    });

    await next();

    // 当用户离开时
    nsp.adapter.clients(rooms, (err, clients) => {
      logger.debug('#leave', room);

      const _clients = {};
      clients.forEach(client => {
        const _id = client.split('#')[1];
        const _client = app.io.sockets.sockets[_id];
        const _query = _client.handshake.query;
        _clients[client] = _query;
      });

      logger.debug('#online_leave', _clients);

      // 更新在线用户列表
      nsp.to(room).emit('online', {
        clients: _clients,
        action: 'leave',
        target: 'participator',
        message: `User(${id}) leaved.`,
      });
    });
  };
};
