'use strict';
/*
  Este código define o modelo Notificacao usando o Sequelize. Ele descreve a estrutura 
  da tabela de notificações e suas associações com outros modelos. O modelo Notificacao possui 
  campos como id, agenda_id, usuario_id, data_notificacao, mensagem, confirmacao_presenca e configuracao.
  Além disso, o método associate define as associações do modelo Notificacao com os modelos Usuario e Agenda, 
  indicando os relacionamentos entre eles por meio de chaves estrangeiras.
  O modelo Notificacao é exportado para ser usado em outras partes da aplicação.
*/

//...

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Notificacao extends Model {
    static associate(models) {
      // Associações do modelo Notificacao com outros modelos
      this.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id',
        targetKey: 'id',
        as: 'usuario'
      });

      this.belongsTo(models.Agenda, {
        foreignKey: 'agenda_id',
        targetKey: 'id',
        as: 'agenda'
      });
      this.belongsTo(models.Configuracao, {
        foreignKey: 'config_id',
        targetKey: 'id',
        as: 'configuracao'
      });
    }
  }

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
    config_id: {
      type: DataTypes.INTEGER
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
    confirmacao_finalizacao: {
      type: DataTypes.BOOLEAN,
    },
    contagem:{
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    notif_view:{
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    
  }, {
    sequelize,
    modelName: 'Notificacao',
    tableName: 'notificacoes',
  
    hooks: {
      beforeCreate: (notificacao, options) => {
        notificacao.contagem++; // Incrementa a contagem toda vez que uma notificação for criada
      },
      
      beforeUpdate: (notificacao, options) => {
        const confirmacao_finalizacao = notificacao.confirmacao_finalizacao;
        if (confirmacao_finalizacao === true) {
          notificacao.confirmacao_presenca = true
        }
      }
    }
  });
  

  return Notificacao;
};


