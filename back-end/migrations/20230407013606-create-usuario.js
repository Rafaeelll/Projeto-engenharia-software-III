'use strict';

/**
 * Arquivo de migração para criar a tabela 'usuarios' no banco de dados.
 * Esta migração cria a tabela 'usuarios' com os campos especificados.
 * Também define as configurações de cada campo, como tipo, allowNull e unique.
 * Define também as configurações para as colunas 'createdAt' e 'updatedAt'.
 * 
 * Este arquivo de migração realiza as seguintes ações:
  Cria a tabela 'usuarios' com os campos especificados, como 'id', 'nome', 'sobrenome', 'email', etc.
  Define as configurações para cada coluna, como tipo de dados, se é permitido valor nulo (allowNull) e se é único (unique).
  Define as configurações para as colunas 'createdAt' e 'updatedAt'.
  A função up é executada quando a migração é aplicada, criando a tabela.
  A função down é executada quando a migração é revertida, eliminando a tabela 'usuarios'.
 */

/** Importa o objeto Migration do sequelize-cli */
/** Este objeto é usado para criar as migrações */
module.exports = {
  /** Função assíncrona 'up' é chamada quando a migração é executada para cima */
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
        allowNull: false,
        unique: true
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
        type: Sequelize.DATEONLY,
      },
      plataforma_fav: {
        type: Sequelize.ENUM('Twitch', 'Kick', 'Youtube', 'Facebook', 'Outros'),
      },
      jogo_fav: {
        type: Sequelize.STRING(50)
      },
      image:{
        type: Sequelize.STRING,
      },
      contagem_acesso:{
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      firstLogin:{
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      status:{
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      confirmationToken: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      confirmationTokenExpires: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      registerConfirmed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      passwordResetToken: {
        type: Sequelize.STRING(200),
        select: false,
      },
      passwordResetExpires: {
        type: Sequelize.DATE,
        select: false,
      },
      pushSubscription: {  // Adicionando o campo pushSubscription
        type: Sequelize.JSON,
        allowNull: true,
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
  /** Função assíncrona 'down' é chamada quando a migração é revertida */
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('usuarios');
  }
};
