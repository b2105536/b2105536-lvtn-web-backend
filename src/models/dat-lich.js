'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DatLich extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  DatLich.init({
    ttDatLichId: DataTypes.STRING,
    chuTroId: DataTypes.INTEGER,
    sinhVienId: DataTypes.INTEGER,
    ngayDat: DataTypes.DATE,
    loaiTG: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'DatLich',
    tableName: 'Dat_Lich',
  });
  return DatLich;
};