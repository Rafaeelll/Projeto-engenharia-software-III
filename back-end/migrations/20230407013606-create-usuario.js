'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('usuarios', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nome: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      sobrenome: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      senha_acesso: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      telefone: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      data_nasc: {
        type: Sequelize.DATE,
      },
      plataforma_fav: {
        type: Sequelize.STRING(50)
      },
      jogo_fav: {
        type: Sequelize.STRING(50)
      },
      foto_perfil: {
        type: Sequelize.STRING(250)
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
    await queryInterface.dropTable('usuarios');
  }
};