'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);

  router.post('/register', controller.user.register); // 用户注册
  router.post('/login', controller.user.login); // 用户登录
};
