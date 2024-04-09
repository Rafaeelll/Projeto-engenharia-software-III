'use strict';
/**
 * 
 * Este arquivo de migração realiza as seguintes ações:

  Cria a tabela 'agendas' com os campos especificados, como 'id', 'usuario_id', 'jogo_id', 'data_horario_inicio', etc.
  Define as configurações para cada coluna, como tipo de dados, se é permitido valor nulo (allowNull), etc.
  Define as configurações para as colunas 'createdAt' e 'updatedAt'.
  A função up é executada quando a migração é aplicada, criando a tabela.
  A função down é executada quando a migração é revertida, eliminando a tabela 'agendas'.
 */

/** Importa o objeto Migration do sequelize-cli */
/** Este objeto é usado para criar as migrações */
module.exports = {
  /** Função assíncrona 'up' é chamada quando a migração é executada para cima */
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
        allowNull: false
      },
      data_horario_inicio:{ // Data e horario do inicio da agenda
        type: Sequelize.DATE,
        allowNull: false
      },
      data_horario_fim:{ // Data e horario do fim da agenda
        type: Sequelize.DATE,
        allowNull: false,
      },
      p_data_horario_inicio:{ // data e horario do inicio da pausa (opcional para agendas com durações menor do que 3hrs)
        type: Sequelize.DATE,
      },
      p_data_horario_fim:{ // data e horario do fim da pausa.
        type: Sequelize.DATE,
      },
      titulo_agenda:{
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      plt_transm:{
        type: Sequelize.ENUM('Twitch', 'Kick', 'Youtube', 'Facebook', 'Outros'),
        allowNull: false
      },
      descricao:{
        type: Sequelize.TEXT,
      },
      status:{
        type: Sequelize.ENUM('Agendado', 'Em andamento', 'Finalizada'),
        defaultValue: 'Agendado'
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
    await queryInterface.dropTable('agendas');
  }
};
