'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Visualizacao extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Usuario,{
        foreignKey: 'usuario_id', // Nome do campo na tabela de ORIGEM
        targetKey: 'id',       // Nome do campo na tabela de DESTINO
        as: 'usuario'             // Nome do atributo para exibição
      })
      this.belongsTo(models.Agenda,{
        foreignKey: 'agenda_id', // Nome do campo na tabela de ORIGEM
        targetKey: 'id',       // Nome do campo na tabela de DESTINO
        as: 'agenda'             // Nome do atributo para exibição
      })
    }
  }
  Visualizacao.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    agenda_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    data_visualizacao: {
      type: DataTypes.DATE,
      allowNull: false
    },
    numero_visualizacao: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Visualizacao',
    tableName: 'visualizacoes'
  });
  return Visualizacao;
};