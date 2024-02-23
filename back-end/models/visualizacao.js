'use strict';

/* 
  Este código define o modelo Visualizacao usando o Sequelize. Ele descreve a estrutura da tabela de visualizações 
  e suas associações com outros modelos.
  Os campos definidos na tabela de visualizações incluem id, usuario_id, agenda_id e numero_visualizacao.

  Além disso, o método associate define as associações do modelo Visualizacao com os modelos Usuario e Agenda, 
  indicando os relacionamentos entre eles por meio de chaves estrangeiras.
*/
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Visualizacao extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define as associações do modelo Visualizacao com outros modelos
      this.belongsTo(models.Usuario,{
        foreignKey: 'usuario_id', // Nome do campo na tabela de ORIGEM
        targetKey: 'id',       // Nome do campo na tabela de DESTINO
        as: 'usuario'             // Nome do atributo para exibição
      });
      this.belongsTo(models.Agenda,{
        foreignKey: 'agenda_id', // Nome do campo na tabela de ORIGEM
        targetKey: 'id',       // Nome do campo na tabela de DESTINO
        as: 'agenda'             // Nome do atributo para exibição
      });
    }
  }

  // Definição dos campos e tipos na tabela Visualizacao
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
    numero_visualizacao: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Visualizacao',    // Nome do modelo
    tableName: 'visualizacoes'     // Nome da tabela no banco de dados
  });

  return Visualizacao;
};
