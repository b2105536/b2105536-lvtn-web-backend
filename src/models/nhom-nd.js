'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NhomND extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  NhomND.init({
    tenNhom: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'NhomND',
    tableName: 'Nhom_ND',
  });
  return NhomND;
};