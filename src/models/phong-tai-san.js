'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PhongTaiSan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PhongTaiSan.belongsTo(models.TaiSan, {
        foreignKey: 'taiSanId'
      });
      PhongTaiSan.belongsTo(models.Phong, {
        foreignKey: 'phongId'
      });
    }
  }
  PhongTaiSan.init({
    phongId: DataTypes.INTEGER,
    taiSanId: DataTypes.INTEGER,
    soLuong: DataTypes.INTEGER,
    tinhTrang: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'PhongTaiSan',
    tableName: 'Phong_Tai_San',
  });
  return PhongTaiSan;
};