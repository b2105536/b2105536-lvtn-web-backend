'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HopDong extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      HopDong.hasMany(models.HoaDon, {
        foreignKey: 'hopDongId'
      });
      HopDong.hasMany(models.SuDung, {
        foreignKey: 'hopDongId'
      });
      HopDong.belongsToMany(models.DichVu, {
        through: 'SuDung',
        foreignKey: 'hopDongId',
        otherKey: 'dichVuId'
      });
      HopDong.belongsTo(models.Phong, {
        foreignKey: 'phongId'
      });
      HopDong.belongsTo(models.NguoiDung, {
        foreignKey: 'chuTroId'
      });
      HopDong.belongsTo(models.NguoiDung, {
        foreignKey: 'sinhVienId'
      });
      HopDong.belongsTo(models.BangMa, {
        foreignKey: 'ttHopDongId'
      });
    }
  }
  HopDong.init({
    ngayLap: DataTypes.DATE,
    noiDung: DataTypes.STRING,
    chuTroId: DataTypes.INTEGER,
    sinhVienId: DataTypes.INTEGER,
    phongId: DataTypes.INTEGER,
    ngayBD: DataTypes.DATE,
    ngayKT: DataTypes.DATE,
    giaThueTrongHD: DataTypes.STRING,
    ttHopDongId: DataTypes.STRING,
    tienDatCoc: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'HopDong',
    tableName: 'Hop_Dong',
  });
  return HopDong;
};