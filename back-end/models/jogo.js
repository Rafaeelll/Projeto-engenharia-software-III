'use strict';

/*
  Este código define o modelo Jogo usando o Sequelize. Ele descreve a estrutura da tabela de 
  jogos e suas associações com outros modelos. O modelo Jogo possui campos como id, nome, usuario_id e data_jogo.
  Além disso, o método associate define as associações do modelo Jogo com os modelos Agenda e HistoricoJogo, 
  indicando os relacionamentos entre eles por meio de chaves estrangeiras.
  O modelo Jogo é exportado para ser usado em outras partes da aplicação.

*/

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Jogo extends Model {
    static associate(models) {
      // Associações do modelo Jogo com outros modelos
      this.hasMany(models.Agenda, {
        foreignKey: 'jogo_id',    // Chave estrangeira na tabela de Agenda
        sourceKey: 'id',          // Chave local na tabela de Jogo
        as: 'agendas'             // Nome do atributo para exibição (plural)
      });

      this.hasMany(models.HistoricoJogo, {
        foreignKey: 'jogo_id',    // Chave estrangeira na tabela de HistoricoJogo
        sourceKey: 'id',          // Chave local na tabela de Jogo
        as: 'historico_jogos'     // Nome do atributo para exibição (plural)
      });

      this.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id', // Chave estrangeira na tabela de Jogo
        targetKey: 'id',           // Chave na tabela de Usuario
        as: 'usuario'              // Nome do atributo para exibição
      });
    }
  }

  // Definição dos campos e tipos na tabela Jogo
  Jogo.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    nome: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    data_jogo: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Jogo',    // Nome do modelo
    tableName: 'jogos'     // Nome da tabela no banco de dados
  });

  return Jogo;
};
