'use strict';

const crypto = require('crypto');
module.exports = app => {
  const { STRING, INTEGER, DATE, ENUM } = app.Sequelize;
  // 配置（重要：一定要配置详细，一定要！！！）
  const User = app.model.define('user', {
    id: {
      type: INTEGER(20).UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: STRING(30),
      allowNull: false,
      defaultValue: '',
      comment: '用户名称',
      unique: true,
    },
    nickname: {
      type: STRING(30),
      allowNull: false,
      defaultValue: '',
      comment: '昵称',
    },
    email: {
      type: STRING(160),
      comment: '用户邮箱',
      unique: true,
    },
    password: {
      type: STRING(200),
      allowNull: false,
      defaultValue: '',
      set(val) {
        const hmac = crypto.createHash('sha256', app.config.crypto.secret);
        hmac.update(val);
        const hash = hmac.digest('hex');
        this.setDataValue('password', hash);
      },
    },
    avatar: {
      type: STRING(200),
      allowNull: true,
      defaultValue: '',
    },
    phone: {
      type: STRING(20),
      comment: '用户手机',
      unique: true,
    },
    sex: {
      type: ENUM,
      values: [ '男', '女', '保密' ],
      allowNull: true,
      defaultValue: '男',
      comment: '用户性别',
    },
    status: {
      type: INTEGER(1),
      allowNull: false,
      defaultValue: 1,
      comment: '状态',
    },
    sign: {
      type: STRING(200),
      allowNull: true,
      defaultValue: '',
      comment: '个性签名',
    },
    area: {
      type: STRING(200),
      allowNull: true,
      defaultValue: '',
      comment: '地区',
    },
    created_at: DATE,
    updated_at: DATE,
  });

  return User;
};
