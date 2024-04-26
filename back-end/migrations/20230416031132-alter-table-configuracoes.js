'use strict';

/**
 * Migração para adicionar restrições de chave estrangeira à tabela 'configuracoes'.
 * Este arquivo adiciona chaves estrangeiras para os campos 'usuario_id' e 'jogo_id'.
 * Define as tabelas e campos de referência, bem como as ações de onDelete e onUpdate.
 */

/** Importa o objeto Migration do sequelize-cli */
/** Este objeto é usado para criar as migrações */
module.exports = {
  /**
   * A função assíncrona 'up' é chamada quando a migração é executada para cima.
   * Adiciona as restrições de chave estrangeira à tabela 'configuracoes'.
   */
  async up(queryInterface, Sequelize) {
    // Adiciona a restrição de chave estrangeira para o campo 'usuario_id'
    await queryInterface.addConstraint('configuracoes', {
      fields: ['usuario_id'], // Campo(s) da tabela de origem
      type: 'foreign key',
      name: 'config_usuario_fk', // Nome da chave estrangeira (deve ser único do BD)
      references:{
        table: 'usuarios', // Tabela estrangeira
        field: 'id'      // Campo da tabela estrangeira
      },
      onDelete: 'RESTRICT', // Não permite apagar um usuário em uso nas configuracoes
      onUpdate: 'CASCADE'   // Atualiza usuario_id nas configuracoes se id do usuário mudar
    });
  },

  /**
   * A função assíncrona 'down' é chamada quando a migração é revertida.
   * Remove as restrições de chave estrangeira da tabela 'configuracoes'.
   */
  async down(queryInterface, Sequelize) {
    // Remove a restrição de chave estrangeira para o campo 'usuario_id'
    await queryInterface.removeConstraint('configuracoes', 'config_usuario_fk');
  }
};
