'use strict';

/**
 * Migração para adicionar uma restrição de chave estrangeira à tabela 'jogos'.
 * Este arquivo adiciona uma chave estrangeira para o campo 'usuario_id'.
 * Define a tabela e campo de referência, bem como as ações de onDelete e onUpdate.
 */

/** Importa o objeto Migration do sequelize-cli */
/** Este objeto é usado para criar as migrações */
module.exports = {
  /**
   * A função assíncrona 'up' é chamada quando a migração é executada para cima.
   * Adiciona a restrição de chave estrangeira à tabela 'jogos'.
   */
  async up(queryInterface, Sequelize) {
    // Adiciona a restrição de chave estrangeira para o campo 'usuario_id'
    await queryInterface.addConstraint('jogos', {
      fields: ['usuario_id'], // Campo(s) da tabela de origem
      type: 'foreign key',
      name: 'jogo_usuarios_fk', // Nome da chave estrangeira (deve ser único do BD)
      references:{
        table: 'usuarios', // Tabela estrangeira
        field: 'id'      // Campo da tabela estrangeira
      },
      onDelete: 'RESTRICT', // Não permite apagar um usuário em uso nos jogos
      onUpdate: 'CASCADE'   // Atualiza usuario_id nos jogos se id do usuário mudar
    });
  },

  /**
   * A função assíncrona 'down' é chamada quando a migração é revertida.
   * Remove a restrição de chave estrangeira da tabela 'jogos'.
   */
  async down(queryInterface, Sequelize) {
    // Remove a restrição de chave estrangeira para o campo 'usuario_id'
    await queryInterface.removeConstraint('jogos', 'jogo_usuarios_fk');
  }
};
