'use strict';

/**
 * Migração para adicionar restrições de chave estrangeira à tabela 'agendas'.
 * Este arquivo adiciona chaves estrangeiras para os campos 'usuario_id' e 'jogo_id'.
 * Define as tabelas e campos de referência, bem como as ações de onDelete e onUpdate.
 */

/** Importa o objeto Migration do sequelize-cli */
/** Este objeto é usado para criar as migrações */
module.exports = {
  /**
   * A função assíncrona 'up' é chamada quando a migração é executada para cima.
   * Adiciona as restrições de chave estrangeira à tabela 'agendas'.
   */
  async up(queryInterface, Sequelize) {
    // Adiciona a restrição de chave estrangeira para o campo 'usuario_id'
    await queryInterface.addConstraint('agendas', {
      fields: ['usuario_id'], // Campo(s) da tabela de origem
      type: 'foreign key',
      name: 'agenda_usuario_fk', // Nome da chave estrangeira (deve ser único do BD)
      references:{
        table: 'usuarios', // Tabela estrangeira
        field: 'id'      // Campo da tabela estrangeira
      },
      onDelete: 'RESTRICT', // Não permite apagar um usuário em uso nas agendas
      onUpdate: 'CASCADE'   // Atualiza usuario_id nas agendas se id do usuário mudar
    });

    // Adiciona a restrição de chave estrangeira para o campo 'jogo_id'
    await queryInterface.addConstraint('agendas', {
      fields: ['jogo_id'], // Campo(s) da tabela de origem
      type: 'foreign key',
      name: 'agenda_jogos_fk', // Nome da chave estrangeira (deve ser único do BD)
      references:{
        table: 'jogos', // Tabela estrangeira
        field: 'id'      // Campo da tabela estrangeira
      },
      onDelete: 'CASCADE', // Não permite apagar um jogo em uso nas agendas
      onUpdate: 'CASCADE'   // Atualiza jogo_id nas agendas se id do jogo mudar
    });

    await queryInterface.addConstraint('agendas', {
      fields: ['config_id'], // Campo(s) da tabela de origem
      type: 'foreign key',
      name: 'agenda_config_fk', // Nome da chave estrangeira (deve ser único do BD)
      references:{
        table: 'configuracoes', // Tabela estrangeira
        field: 'id'      // Campo da tabela estrangeira
      },
      onDelete: 'CASCADE', // Não permite apagar um jogo em uso nas agendas
      onUpdate: 'CASCADE'   // Atualiza jogo_id nas agendas se id do jogo mudar
    });
  },

  /**
   * A função assíncrona 'down' é chamada quando a migração é revertida.
   * Remove as restrições de chave estrangeira da tabela 'agendas'.
   */
  async down(queryInterface, Sequelize) {
    // Remove a restrição de chave estrangeira para o campo 'jogo_id'
    await queryInterface.removeConstraint('agendas', 'agenda_config_fk');
    // Remove a restrição de chave estrangeira para o campo 'jogo_id'
    await queryInterface.removeConstraint('agendas', 'agenda_jogos_fk');
    // Remove a restrição de chave estrangeira para o campo 'usuario_id'
    await queryInterface.removeConstraint('agendas', 'agenda_usuario_fk');
  }
};
