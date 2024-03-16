'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('historico_jogos', {
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
      jogo_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      nivel: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      jogo_status:{
        type: Sequelize.ENUM('Não iniciado', 'Em progresso', 'Concluído'),
        defaultValue: 'Não iniciado',
      },
      jogo_iniciado:{
        type: Sequelize.BOOLEAN,
      },
      jogo_zerado:{
        type: Sequelize.BOOLEAN,
      },
      avaliacao: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: true,
        validate: {
          min: 1,
          max: 5
        }
      },
      comentario_usuario:{
        type: Sequelize.TEXT
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
    await queryInterface.dropTable('historico_jogos');
  }
};