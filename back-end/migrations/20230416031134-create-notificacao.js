'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('notificacoes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      agenda_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      data_notificacao: {
        type: Sequelize.DATE,
        allowNull: false
      },
      mensagem: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      confirmacao_presenca: {
        type: Sequelize.BOOLEAN,
      },
      confirmacao_finalizacao: {
        type: Sequelize.BOOLEAN,
      },
      contagem:{
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      configuracao: {
        type: Sequelize.JSON, // Ou outro tipo de dados apropriado
        allowNull: true // Ou false, dependendo se a configuração é obrigatória ou não
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('notificacoes');
  }
};