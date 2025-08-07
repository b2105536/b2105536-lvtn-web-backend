'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TaiSan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TaiSan.hasMany(models.PhongTaiSan, {
        foreignKey: 'taiSanId'
      });
      TaiSan.belongsToMany(models.Phong, {
        through: models.PhongTaiSan,
        foreignKey: 'taiSanId',
        otherKey: 'phongId'
      });
    }
  }
  TaiSan.init({
    tenTaiSan: DataTypes.STRING,
    moTaTaiSan: DataTypes.TEXT,
    dvtTaiSan: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'TaiSan',
    tableName: 'Tai_San',
  });
  return TaiSan;
};