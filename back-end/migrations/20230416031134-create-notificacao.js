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
      config_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      data_notificacao: {
        type: Sequelize.DATE,
        allowNull: false
      },
      mensagem: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      contagem:{
        type: Sequelize.INTEGER,
        defaultValue: 0
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