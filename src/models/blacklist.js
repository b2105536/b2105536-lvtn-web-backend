'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Blacklist extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Blacklist.belongsTo(models.NguoiDung, {
        foreignKey: 'sinhVienId'
      });
    }
  }
  Blacklist.init({
    sinhVienId: DataTypes.INTEGER,
    ngayChan: DataTypes.DATE,
    lyDo: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'Blacklist',
    tableName: 'Blacklist',
  });
  return Blacklist;
};