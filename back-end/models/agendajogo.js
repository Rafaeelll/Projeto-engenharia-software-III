'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AgendaJogo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Agenda,{
        foreignKey:'agenda_id',
        targetKey: 'id',
        as: 'agenda'
      })
      this.belongsTo(models.Jogo,{
        foreignKey:'jogo_id',
        targetKey: 'id',
        as: 'jogo'
      })
    }
  }
  AgendaJogo.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    agenda_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    jogo_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'AgendaJogo',
    tableName: 'agenda_jogos'
  });
  return AgendaJogo;
};