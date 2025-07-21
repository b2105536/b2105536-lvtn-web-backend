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
      DichVu.hasMany(models.GiaDichVu, {
        foreignKey: 'dichVuId'
      });
      DichVu.belongsTo(models.NguoiDung, {
        foreignKey: 'chuTroId'
      });
      DichVu.hasMany(models.SuDung, {
        foreignKey: 'dichVuId'
      });
      DichVu.belongsToMany(models.HopDong, {
        through: 'SuDung',
        foreignKey: 'dichVuId',
        otherKey: 'hopDongId'
      });
    }
  }
  DichVu.init({
    tenDV: DataTypes.STRING,
    donViTinh: DataTypes.STRING,
    ghiChuDV: DataTypes.STRING,
    chuTroId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'DichVu',
    tableName: 'Dich_Vu',
  });
  return DichVu;
};