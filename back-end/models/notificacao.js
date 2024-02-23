'use strict';

/*
  Este código define o modelo Notificacao usando o Sequelize. Ele descreve a estrutura 
  da tabela de notificações e suas associações com outros modelos. O modelo Notificacao possui 
  campos como id, agenda_id, usuario_id, data_notificacao, mensagem, confirmacao_presenca e configuracao.
  Além disso, o método associate define as associações do modelo Notificacao com os modelos Usuario e Agenda, 
  indicando os relacionamentos entre eles por meio de chaves estrangeiras.
  O modelo Notificacao é exportado para ser usado em outras partes da aplicação.
*/

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Notificacao extends Model {
    static associate(models) {
      // Associações do modelo Notificacao com outros modelos
      this.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id', // Chave estrangeira na tabela de Notificacao
        targetKey: 'id',          // Chave na tabela de Usuario
        as: 'usuario'             // Alias para a associação
      });

      this.belongsTo(models.Agenda, {
        foreignKey: 'agenda_id',  // Chave estrangeira na tabela de Notificacao
        targetKey: 'id',          // Chave na tabela de Agenda
        as: 'agenda'              // Alias para a associação
      });
    }
  }

  // Definição dos campos e tipos na tabela Notificacao
  Notificacao.init({
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
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    data_notificacao: {
      type: DataTypes.DATE,
      allowNull: false
    },
    mensagem: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    confirmacao_presenca: {
      type: DataTypes.BOOLEAN,
    },
    configuracao: {
      type: DataTypes.JSON,
      allowNull: true
    },
  }, {
    sequelize,
    modelName: 'Notificacao',   // Nome do modelo
    tableName: 'notificacoes'    // Nome da tabela no banco de dados
  });

  return Notificacao;
};
