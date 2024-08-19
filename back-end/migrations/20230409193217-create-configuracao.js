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
      usuario_id:{
        type: Sequelize.INTEGER,
        allowNull: false
      },
      confirmar_auto_ini: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      confirmar_auto_fim: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      horario_notif_inicio: {
        type: Sequelize.ENUM('1 Hora Antes (Padrão)', '30 minutos antes', 'No Início'),
        allowNull: false,

      },
      horario_notif_fim: {
        type: Sequelize.ENUM('1 Hora Antes', '30 minutos antes', 'No Fim (Padrão)'),
        allowNull: false,
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