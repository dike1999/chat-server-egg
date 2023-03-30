'use strict';

const { Controller } = require('egg');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.apiSuccess([{
      id: 1,
      name: '1',
    }, {
      id: 2,
      name: '2',
    }]);
  }
}

module.exports = HomeController;
