'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('jogos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nome: {
        type: Sequelize.STRING(50),
        allowNull:false,
      },
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      data_aquisicao: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      plataforma_jogo:{
        type: Sequelize.ENUM( 'PC', 'Console Xbox', 'PlayStation', 'Nintendo Switch', 'Dispositivo Móvel'),
      },
      preco_jogo:{
        type: Sequelize.DECIMAL(10,2)
      },
      categoria: {
        type: Sequelize.ENUM('Sobrevivência', 'Ação e aventura', 'Luta', 'Jogos Esportivos', 'Stealth (Furtividade)', 'RPG', 'FPS', 'MMORPG', 'MOBA',  'Battle Royale'),
        allowNull: false,
      },
      modo_jogo_fav:{
        type: Sequelize.ENUM('Campanha Solo', 'Multijogador Online', 'Cooperativo Local'),
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
    await queryInterface.dropTable('jogos');
  }
};