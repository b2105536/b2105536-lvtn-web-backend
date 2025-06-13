'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tinh extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Tinh.init({
    tenTinh: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Tinh',
    tableName: 'Tinh',
  });
  return Tinh;
};