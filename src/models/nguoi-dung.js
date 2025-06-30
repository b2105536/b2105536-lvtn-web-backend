'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NguoiDung extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  NguoiDung.init({
    soDienThoai: DataTypes.STRING,
    matKhau: DataTypes.STRING,
    hoTen: DataTypes.STRING,
    email: DataTypes.STRING,
    soDD: DataTypes.STRING,
    gioiTinh: DataTypes.BOOLEAN,
    ngaySinh: DataTypes.DATEONLY,
    dcThuongTru: DataTypes.STRING,
    anhDD: DataTypes.STRING,
    nhomId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'NguoiDung',
    tableName: 'Nguoi_Dung',
  });
  return NguoiDung;
};