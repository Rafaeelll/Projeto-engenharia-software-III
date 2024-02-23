'use strict';

/**
 * Migração para adicionar restrições de chave estrangeira à tabela 'visualizacoes'.
 * Este arquivo adiciona chaves estrangeiras para os campos 'usuario_id' e 'agenda_id'.
 * Define as tabelas e campos de referência, bem como as ações de onDelete e onUpdate.
 */

/** Importa o objeto Migration do sequelize-cli */
/** Este objeto é usado para criar as migrações */
module.exports = {
  /**
   * A função assíncrona 'up' é chamada quando a migração é executada para cima.
   * Adiciona as restrições de chave estrangeira à tabela 'visualizacoes'.
   */
  async up(queryInterface, Sequelize) {
    // Adiciona a restrição de chave estrangeira para o campo 'usuario_id'
    await queryInterface.addConstraint('visualizacoes', {
      fields: ['usuario_id'], // Campo(s) da tabela de origem
      type: 'foreign key',
      name: 'visualizacao_usuarios_fk', // Nome da chave estrangeira (deve ser único do BD)
      references:{
        table: 'usuarios', // Tabela estrangeira
        field: 'id'      // Campo da tabela estrangeira
      },
      onDelete: 'RESTRICT', // Não permite apagar um usuário em uso nas visualizações
      onUpdate: 'CASCADE'   // Atualiza usuario_id nas visualizações se id do usuário mudar
    });

    // Adiciona a restrição de chave estrangeira para o campo 'agenda_id'
    await queryInterface.addConstraint('visualizacoes', {
      fields: ['agenda_id'], // Campo(s) da tabela de origem
      type: 'foreign key',
      name: 'visualizacao_agendas_fk', // Nome da chave estrangeira (deve ser único do BD)
      references:{
        table: 'agendas', // Tabela estrangeira
        field: 'id'      // Campo da tabela estrangeira
      },
      onDelete: 'RESTRICT', // Não permite apagar uma agenda em uso nas visualizações
      onUpdate: 'CASCADE'   // Atualiza agenda_id nas visualizações se id da agenda mudar
    });
  },

  /**
   * A função assíncrona 'down' é chamada quando a migração é revertida.
   * Remove as restrições de chave estrangeira da tabela 'visualizacoes'.
   */
  async down(queryInterface, Sequelize) {
    // Remove a restrição de chave estrangeira para o campo 'agenda_id'
    await queryInterface.removeConstraint('visualizacoes', 'visualizacao_agendas_fk');
    // Remove a restrição de chave estrangeira para o campo 'usuario_id'
    await queryInterface.removeConstraint('visualizacoes', 'visualizacao_usuarios_fk');
  }
};
