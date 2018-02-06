'use strict';

const Service = require('egg').Service;

class PostService extends Service {
  create(post) {
    return this.app.model.Post.create(post).exec();
  }

  // 通过文章 id 获取一篇文章
  getPostById(postId) {
    return this.app.model.Post.findOne({ _id: postId })
      .populate({
        path: 'author',
        model: 'User',
      })
      .safetyMode()
      .addCreatedAt()
      .contentToHtml()
      .exec();
  }

  // 按创建时间降序获取所有用户文章或者某个特定用户的所有文章
  getPosts(author) {
    const query = {};
    if (author) {
      query.author = author;
    }
    return this.app.model.Post.find(query)
      .sort({ _id: -1 })
      .addCreatedAt()
      .contentToHtml()
      .addCommentsCount()
      .exec();
  }

  // 通过文章 id 给 pv 加 1
  incPv(postId) {
    this.app.model.Post.update({ _id: postId }, { $inc: { pv: 1 } }).exec();
  }
  // 通过文章 id 获取一篇原生文章（编辑文章）
  getRawPostById(postId) {
    this.app.model.Post.findOne({ _id: postId })
      .populate({ path: 'author', model: 'User' })
      .exec();
  }

  // 通过用户 id 和文章 id 更新一篇文章
  updatePostById(postId, author, data) {
    this.app.model.Post.update(
      { author, _id: postId },
      { $set: data }
    ).exec();
  }

  // 通过用户 id 和文章 id 删除一篇文章
  delPostById(postId, author) {
    this.app.model.Post.remove({ author, _id: postId })
      .exec()
      .then(function(res) {
        // 文章删除后，再删除该文章下的所有留言
        if (res.result.ok && res.result.n > 0) {
          return this.app.model.Comment.delCommentsByPostId(postId);
        }
      });
  }
}

module.exports = PostService;
