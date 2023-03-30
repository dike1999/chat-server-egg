module.exports = {
  // api返回成功
  apiSuccess(data = '', msg = 'ok', code = 200) {
    this.status = code;
    this.body = { msg, data };
  },
  // api返回失败
  apiFail(data = '', msg = 'fail', code = 400) {
    this.status = code;
    this.body = { msg, data };
  },
};
