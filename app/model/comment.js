'use strict';

const Mongolass = require('mongolass');

module.exports = app => {
  const { mongolass } = app;
  const Comment = mongolass.model('Comment', {
    author: { type: Mongolass.Types.ObjectId },
    content: { type: 'string' },
    postId: { type: Mongolass.Types.ObjectId },
  });
  Comment.index({ postId: 1, _id: 1 }).exec(); // 通过文章 id 获取该文章下所有留言，按留言创建时间升序
  Comment.index({ author: 1, _id: 1 }).exec(); // 通过用户 id 和留言 id 删除一个留言
};
