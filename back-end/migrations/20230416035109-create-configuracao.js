'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('configuracoes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      tempo_maximo: {
        type: Sequelize.DATE,
        allowNull: false
      },
      alerta: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      hora_inicio: {
        type: Sequelize.DATE,
        allowNull: false
      },
      plt_transmi: {
        type: Sequelize.STRING(50)
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
    await queryInterface.dropTable('configuracoes');
  }
};