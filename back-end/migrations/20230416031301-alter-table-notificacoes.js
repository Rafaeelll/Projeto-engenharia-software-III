'use strict';

/**
 * Migração para adicionar restrições de chave estrangeira à tabela 'notificacoes'.
 * Este arquivo adiciona chaves estrangeiras para os campos 'usuario_id' e 'agenda_id'.
 * Define as tabelas e campos de referência, bem como as ações de onDelete e onUpdate.
 */

/** Importa o objeto Migration do sequelize-cli */
/** Este objeto é usado para criar as migrações */
module.exports = {
  /**
   * A função assíncrona 'up' é chamada quando a migração é executada para cima.
   * Adiciona as restrições de chave estrangeira à tabela 'notificacoes'.
   */
  async up(queryInterface, Sequelize) {
    // Adiciona a restrição de chave estrangeira para o campo 'usuario_id'
    await queryInterface.addConstraint('notificacoes', {
      fields: ['usuario_id'], // Campo(s) da tabela de origem
      type: 'foreign key',
      name: 'notificacao_usuarios_fk', // Nome da chave estrangeira (deve ser único do BD)
      references:{
        table: 'usuarios', // Tabela estrangeira
        field: 'id'      // Campo da tabela estrangeira
      },
      onDelete: 'RESTRICT', // Não permite apagar um usuário em uso nas notificações
      onUpdate: 'CASCADE'   // Atualiza usuario_id nas notificações se id do usuário mudar
    });

    // Adiciona a restrição de chave estrangeira para o campo 'agenda_id'
    await queryInterface.addConstraint('notificacoes', {
      fields: ['agenda_id'], // Campo(s) da tabela de origem
      type: 'foreign key',
      name: 'notificacao_agendas_fk', // Nome da chave estrangeira (deve ser único do BD)
      references:{
        table: 'agendas', // Tabela estrangeira
        field: 'id'      // Campo da tabela estrangeira
      },
      onDelete: 'CASCADE', // Não permite apagar uma agenda em uso nas notificações
      onUpdate: 'CASCADE'   // Atualiza agenda_id nas notificações se id da agenda mudar
    });
    // Adiciona a restrição de chave estrangeira para o campo 'config_id'
    await queryInterface.addConstraint('notificacoes', {
      fields: ['config_id'], // Campo(s) da tabela de origem
      type: 'foreign key',
      name: 'notificacao_config_fk', // Nome da chave estrangeira (deve ser único do BD)
      references:{
        table: 'configuracoes', // Tabela estrangeira
        field: 'id'      // Campo da tabela estrangeira
      },
      onDelete: 'CASCADE', // Não permite apagar uma agenda em uso nas notificações
      onUpdate: 'CASCADE'   // Atualiza agenda_id nas notificações se id da agenda mudar
    });
  },

  /**
   * A função assíncrona 'down' é chamada quando a migração é revertida.
   * Remove as restrições de chave estrangeira da tabela 'notificacoes'.
   */
  async down(queryInterface, Sequelize) {
    // Remove a restrição de chave estrangeira para o campo 'agenda_id'
    await queryInterface.removeConstraint('notificacoes', 'notificacao_config_fk');
    // Remove a restrição de chave estrangeira para o campo 'agenda_id'
    await queryInterface.removeConstraint('notificacoes', 'notificacao_agendas_fk');
    // Remove a restrição de chave estrangeira para o campo 'usuario_id'
    await queryInterface.removeConstraint('notificacoes', 'notificacao_usuarios_fk');
  }
};
