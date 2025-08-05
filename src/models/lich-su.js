'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LichSu extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      LichSu.belongsTo(models.NguoiDung, {
        foreignKey: 'chuTroId'
      });
      LichSu.belongsTo(models.NguoiDung, {
        foreignKey: 'sinhVienId'
      });
    }
  }
  LichSu.init({
    chuTroId: DataTypes.INTEGER,
    sinhVienId: DataTypes.INTEGER,
    dienGiai: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'LichSu',
    tableName: 'Lich_Su',
  });
  return LichSu;
};