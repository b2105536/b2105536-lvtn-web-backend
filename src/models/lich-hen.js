'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LichHen extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  LichHen.init({
    slLichHen: DataTypes.INTEGER,
    slToiDa: DataTypes.INTEGER,
    ngayHen: DataTypes.DATE,
    loaiTG: DataTypes.STRING,
    chuTroId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'LichHen',
    tableName: 'Lich_Hen',
  });
  return LichHen;
};