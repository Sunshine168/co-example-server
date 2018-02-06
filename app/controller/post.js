'use strict';

const Controller = require('egg').Controller;

class PostController extends Controller {
  async getPosts() {
    const { author } = this.ctx.query;
    const { user: userService, post: postService } = this.ctx.service;
    this.ctx.validate(
      {
        author: { type: 'string' },
      }[author]
    );
    let resCode = 200,
      message,
      posts,
      user;
    try {
      posts = await userService.getPosts(author);
      user = await postService.getUserById(author);
      if (!user) {
        throw new Error('user did not exist');
      }
    } catch (e) {
      resCode = 500;
      message = '用户不存在';
      this.ctx.logger.warn(e.errors);
    }
    this.ctx.response.body = {
      resCode,
      posts,
      user,
      message,
    };
  }

  async createPost() {
    const { article, user_id } = this.ctx.request.body;
    this.ctx.validate({
      article: { type: 'string' },
      user_id: { type: 'string' },
    });
    const author_id = user_id || this.ctx.session.user._id;
    let resCode = 200,
      message = '发表成功',
      post;
    const postModel = {
      author: author_id,
      title: article.title,
      content: article.context,
      pv: 0,
    };
    try {
      const result = await this.service.post.create(postModel);
      post = result.ops[0];
    } catch (e) {
      resCode = 500;
      message = '发表失败';
      this.ctx.logger.warn(e.errors);
    }
    this.ctx.response.body = {
      resCode,
      post,
      message,
    };
  }

  async getPost() {
    const { postId } = this.ctx.params;
    this.ctx.validate(
      {
        postId: { type: 'string' },
      },
      [ postId ]
    );
    const { user } = this.ctx.session;
    const { post: postService, Comment: commentService } = this.ctx.service;
    let resCode = 200;
    let post,
      message,
      comments;
    try {
      const result = await Promise.all([
        postService.getPostById(postId),
        commentService.getComments(postId),
        postService.incPv(postId),
      ]);
      post = result[0];
      comments = result[1];
      if (!post) {
        throw new Error('cant find post');
      }
    } catch (e) {
      resCode = 500;
      message = '文章不存在';
      this.ctx.logger.warn(e.errors);
    }
    if (user && user._id === post.author_id) {
      this.ctx.response.body = {
        resCode,
        post,
        current: user._id,
        comments,
      };
    } else {
      this.ctx.response.body = {
        resCode,
        post,
        comments,
        message,
      };
    }
  }

  async getEditingPost() {
    let resCode = 200;
    const { postId } = this.ctx.params;
    this.ctx.validate(
      {
        postId: { type: 'string' },
      },
      [ postId ]
    );
    let post,
      message;
    try {
      post = await this.ctx.service.post.getRawPostById(postId); // 获取原生文章信息
      if (!post) {
        throw new Error('cant find post');
      }
    } catch (e) {
      resCode = 500;
      message = '文章不存在';
      this.ctx.logger.warn(e.errors);
    }
    this.ctx.response.body = {
      resCode,
      message,
      post,
    };
  }
  async updatePost() {
    const { ctx } = this;
    let resCode = 200,
      message;
    const author_id = ctx.request.body.user_id || ctx.session.user._id,
      { title, context } = ctx.request.body,
      postId = ctx.params.postId;
    this.ctx.validate(
      {
        postId: { type: 'string' },
        title: { type: 'string' },
        context: { type: 'string' },
      },
      [ postId, title, context ]
    );
    try {
      await ctx.service.post.updatePostById(postId, author_id, {
        title,
        content: context,
      });
    } catch (e) {
      resCode = 500;
      message = '更新失败';
      this.ctx.logger.warn(e.errors);
    }
    ctx.response.body = {
      resCode,
      message,
    };
  }
  async removePost() {
    const { ctx } = this,
      { postId } = ctx.params,
      author = ctx.query.user_id || ctx.session.user._id;
    this.ctx.validate(
      {
        postId: { type: 'string' },
      },
      [ postId ]
    );
    let resCode = 200,
      message = '删除成功';
    try {
      await ctx.service.post.delPostById(postId, author);
    } catch (e) {
      resCode = 500;
      message = '删除失败';
      this.ctx.logger.warn(e.errors);
    }
    ctx.response.body = {
      resCode,
      message,
    };
  }
}

module.exports = PostController;
