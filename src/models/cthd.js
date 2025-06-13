'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CTHD extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CTHD.init({
    slSuDung: DataTypes.STRING,
    dgApDung: DataTypes.STRING,
    thanhTien: DataTypes.STRING,
    dichVuId: DataTypes.INTEGER,
    hoaDonId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'CTHD',
    tableName: 'CTHD',
  });
  return CTHD;
};