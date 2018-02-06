'use strict';

const Service = require('egg').Service;

class CommentService extends Service {
  // 创建一个留言
  create(comment) {
    return this.ctx.model.Comment.create(comment).exec();
  }

  // 通过用户 id 和留言 id 删除一个留言
  delCommentById(commentId, author) {
    return this.ctx.model.Comment.remove({ author, _id: commentId }).exec();
  }

  // 通过文章 id 删除该文章下所有留言
  delCommentsByPostId(postId) {
    return this.ctx.model.Comment.remove({ postId }).exec();
  }

  // 通过文章 id 获取该文章下所有留言，按留言创建时间升序
  getComments(postId) {
    return this.ctx.model.Comment.find({ postId })
      .populate({ path: 'author', model: 'User' })
      .sort({ _id: 1 })
      .addCreatedAt()
      .contentToHtml()
      .exec();
  }

  // 通过文章 id 获取该文章下留言数
  getCommentsCount(postId) {
    return this.ctx.model.Comment.count({ postId }).exec();
  }
}

module.exports = CommentService;
