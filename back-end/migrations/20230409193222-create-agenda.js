'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('agendas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      jogo_id:{
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      data_agenda:{
        type: Sequelize.DATE,
        allowNull: false,
      },
      horario_inicio:{
        type: Sequelize.DATE,
        allowNull: false
      },
      horario_fim:{
        type: Sequelize.DATE,
        allowNull: false,
      },
      titulo_agenda:{
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      plt_transm:{
        type: Sequelize.STRING(100)
      },
      descricao:{
        type: Sequelize.TEXT,
        allowNull: false,
      },
      status:{
        type: Sequelize.ENUM('Agendado', 'Em andamento', 'Finalizada'),
        allowNull: false
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
    await queryInterface.dropTable('agendas');
  }
};