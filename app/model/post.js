'use strict';

const marked = require('market');
const Mongolass = require('mongolass');

module.exports = app => {
  const { mongolass } = app;
  const { Comment } = app.model;
  const Post = mongolass.model('Post', {
    author: { type: Mongolass.Types.ObjectId },
    title: { type: 'string' },
    content: { type: 'string' },
    pv: { type: 'number' },
  });
  // 给 post 添加留言数 commentsCount
  Post.plugin('addCommentsCount', {
    afterFind(posts) {
      return Promise.all(
        posts.map(function(post) {
          return Comment.getCommentsCount(post._id).then(function(
            commentsCount
          ) {
            post.commentsCount = commentsCount;
            return post;
          });
        })
      );
    },
    afterFindOne(post) {
      if (post) {
        return Comment.getCommentsCount(post._id).then(function(count) {
          post.commentsCount = count;
          return post;
        });
      }
      return post;
    },
  });

  // 将 post 的 content 从 markdown 转换成 html
  Post.plugin('contentToHtml', {
    afterFind(posts) {
      return posts.map(function(post) {
        post.content = marked(post.content);
        return post;
      });
    },
    afterFindOne(post) {
      if (post) {
        post.content = marked(post.content);
      }
      return post;
    },
  });
  Post.plugin('safetyMode', {
    afterFindOne(post) {
      if (post) {
        const author = {
          avatar: post.author.avatar,
          bio: post.author.bio,
          name: post.author.name,
          gender: post.author.gender,
          _id: post.author._id,
        };
        delete post.author;
        post.author = author;
      }
      return post;
    },
  });
  Post.index({ author: 1, _id: -1 }).exec();// 按创建时间降序查看用户的文章列表
  return Post;
};
