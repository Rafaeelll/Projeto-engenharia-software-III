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
      config: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: {
          confirmar_auto_ini: false,
          confirmar_auto_fim: false,
          notificar_hora_antes_inicio: true, // Padrão: notificar 1 hora antes da inicialização
          notif_trinta_min_antes_inicio: false, 
          notif_no_inicio: false, 
          notificar_no_fim: true, // Padrão: notificar na hora exata finalização
          notificar_hora_antes_fim: false,
          notif_trinta_min_antes_fim: false, 
        }
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