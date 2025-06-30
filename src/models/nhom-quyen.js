'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NhomQuyen extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  NhomQuyen.init({
    nhomId: DataTypes.INTEGER,
    quyenId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'NhomQuyen',
    tableName: 'Nhom_Quyen',
  });
  return NhomQuyen;
};