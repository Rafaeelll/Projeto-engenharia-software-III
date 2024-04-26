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
    // confirmar_auto_ini: {
    //   type: DataTypes.BOOLEAN,
    //   allowNull: true,
    //   defaultValue: false
    // },
    // confirmar_auto_fim: {
    //   type: DataTypes.BOOLEAN,
    //   allowNull: true,
    //   defaultValue: false
    // },
    // notificar_minutos_antes_inicio: {
    //   type: DataTypes.DATE,
    // }

        // confirmar_auto_ini: false,
        // confirmar_auto_fim: false,
        // notificar_minutos_antes_inicio: 60, // Padrão: notificar 1 hora antes
        // notificar_minutos_antes_fim: 0
  }, {
    sequelize,
    modelName: 'Notificacao',
    tableName: 'notificacoes',
    // hooks: {
    //   beforeCreate: (notificacao, options) => {
    //     notificacao.contagem++; // Incrementa a contagem toda vez que uma notificação for criada
        
    //     const confirmIniAuto = notificacao.confirmar_auto_ini
    //     const confirmFinaAuto = notificacao.confirmar_auto_fim


    //     if (confirmIniAuto === true) {
    //       notificacao.confirmacao_presenca = true
    //     }
    //     else if (confirmFinaAuto === true){
    //       notificacao.confirmacao_finalizacao = true
    //     }
    //   },
    //   beforeUpdate: (notificacao, options) => {
    //     const confirmacao_finalizacao = notificacao.confirmacao_finalizacao;
    //     if (confirmacao_finalizacao === true) {
    //       notificacao.confirmacao_presenca = true
    //     }
    //   }
    // }
  });
  

  return Notificacao;
};
