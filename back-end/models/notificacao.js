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
    contagem:{
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
  }, {
    sequelize,
    modelName: 'Notificacao',
    tableName: 'notificacoes',
  
    hooks: {
      afterCreate: async (notificacao, options) => {
        if (notificacao && notificacao.contagem !== undefined) {
          try {
            const transaction = await sequelize.transaction();
            const count = notificacao.contagem + 1;
            
            await Notificacao.update(
              { contagem: count },
              { where: { usuario_id: notificacao.usuario_id }, transaction }
            );
    
            await transaction.commit();
          } catch (error) {
            await transaction.rollback();
            console.error(error);
          }
        }
      },
    }
  });
  

  return Notificacao;
};


