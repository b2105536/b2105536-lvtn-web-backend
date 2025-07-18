'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BangMa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      BangMa.hasMany(models.DatLich, {
        foreignKey: 'ttDatLichId'
      });
      BangMa.hasMany(models.Phong, {
        foreignKey: 'ttPhongId'
      });
      BangMa.hasMany(models.HopDong, {
        foreignKey: 'ttHopDongId'
      });
      BangMa.hasMany(models.Tinh, {
        foreignKey: 'ttDVHCId'
      });
      BangMa.hasMany(models.Huyen, {
        foreignKey: 'ttDVHCId'
      });
      BangMa.hasMany(models.Xa, {
        foreignKey: 'ttDVHCId'
      });
      BangMa.hasMany(models.LichHen, {
        foreignKey: 'loaiTG'
      });
      BangMa.hasMany(models.DatLich, {
        foreignKey: 'loaiTG'
      });
    }
  }
  BangMa.init({
    tuKhoa: DataTypes.STRING,
    loai: DataTypes.STRING,
    giaTri: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'BangMa',
    tableName: 'Bang_Ma',
  });
  return BangMa;
};