'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChiSo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ChiSo.init({
    thang: DataTypes.STRING,
    csDienTrc: DataTypes.STRING,
    csDienSau: DataTypes.STRING,
    csNuocTrc: DataTypes.STRING,
    csNuocSau: DataTypes.STRING,
    ngayGN: DataTypes.DATE,
    phongId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ChiSo',
    tableName: 'Chi_So',
  });
  return ChiSo;
};