'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Configuracao extends Model {
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
    }
  }
  Configuracao.init({
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
    tempo_maximo: {
      type: DataTypes.DATE,
      allowNull: false
    },
    alerta: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    hora_inicio: {
      type: DataTypes.DATE,
      allowNull: false
    },
    plt_transmi: {
      type: DataTypes.STRING(50)
    },
  }, {
    sequelize,
    modelName: 'Configuracao',
    tableName: 'configuracoes'
  });
  return Configuracao;
};