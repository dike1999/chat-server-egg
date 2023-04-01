'use strict';

const { Controller } = require('egg');
const crypto = require('crypto');

class UserController extends Controller {
  // 验证密码
  async checkPassword(password, hash_password) {
    // 先对需要验证的密码进行加密
    const hmac = crypto.createHash('sha256', this.app.config.crypto.secret);
    hmac.update(password);
    password = hmac.digest('hex');
    const res = password === hash_password;
    if (!res) {
      this.ctx.throw(400, '密码错误');
    }
    return true;
  }
  // 注册账号
  async register() {
    const { ctx, app } = this;
    const { username, password } = ctx.request.body;

    // 参数验证
    ctx.validate({
      username: {
        type: 'string',
        required: true,
        range: {
          min: 5,
          max: 20,
        },
        desc: '用户名',
      },
      password: {
        type: 'string',
        required: true,
        desc: '密码',
      },
      repassword: {
        type: 'string',
        required: true,
        desc: '确认密码',
      },
    }, {
      equals: [
        [ 'password', 'repassword' ],
      ],
    });

    // 验证用户是否已经存在
    if (await app.model.User.findOne({
      where: {
        username,
      },
    })) {
      ctx.throw(400, '用户名已存在');
    }
    // 创建用户
    const user = await app.model.User.create({
      username,
      password,
    });
    if (!user) {
      ctx.throw(400, '创建用户失败');
    }
    ctx.apiSuccess(user);
  }
  // 登录账号
  async login() {
    const { ctx, app } = this;
    // 参数验证
    ctx.validate({
      username: {
        type: 'string',
        required: true,
        desc: '用户名',
      },
      password: {
        type: 'string',
        required: true,
        desc: '密码',
      },
    });
    const { username, password } = ctx.request.body;
    // 验证该用户是否存在|验证该用户状态是否启用
    let user = await app.model.User.findOne({
      where: {
        username,
        status: 1,
      },
    });
    if (!user) {
      ctx.throw(400, '用户不存在或已被禁用');
    }
    // 验证密码
    await this.checkPassword(password, user.password);
    user = JSON.parse(JSON.stringify(user));
    // 生成token
    const token = ctx.getToken(user);
    user.token = token;
    delete user.password;
    // 加入缓存中
    if (!await this.service.cache.set('user_' + user.id, token)) {
      ctx.throw(400, '登录失败');
    }
    // 返回用户信息和token
    return ctx.apiSuccess(user);
  }
}

module.exports = UserController;

