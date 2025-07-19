'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HoaDon extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      HoaDon.belongsTo(models.HopDong, {
        foreignKey: 'hopDongId'
      });
    }
  }
  HoaDon.init({
    ngayTao: DataTypes.DATE,
    tongTienPhaiTra: DataTypes.STRING,
    soTienDaTra: DataTypes.STRING,
    tienDuThangTrc: DataTypes.STRING,
    ghiChuHD: DataTypes.STRING,
    hopDongId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'HoaDon',
    tableName: 'Hoa_Don',
  });
  return HoaDon;
};