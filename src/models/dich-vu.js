'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DichVu extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  DichVu.init({
    tenDV: DataTypes.STRING,
    donViTinh: DataTypes.STRING,
    donGia: DataTypes.STRING,
    ghiChuDV: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'DichVu',
    tableName: 'Dich_Vu',
  });
  return DichVu;
};