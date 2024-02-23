'use strict';

/**
 
 * Este arquivo de migração realiza as seguintes ações:
  Adiciona restrições de chave estrangeira para os campos 'usuario_id' e 'jogo_id' na tabela 'historico_jogos'.
  Define as tabelas e campos de referência para as chaves estrangeiras.
  Define as ações de onDelete e onUpdate. RESTRICT não permite a exclusão de registros referenciados, enquanto CASCADE atualiza automaticamente as referências quando o registro associado é modificado.
  A função up é executada quando a migração é aplicada, adicionando as restrições de chave estrangeira.
  A função down é executada quando a migração é revertida, removendo as restrições de chave estrangeira adicionadas anteriormente.
 */

/** Importa o objeto Migration do sequelize-cli */
/** Este objeto é usado para criar as migrações */
module.exports = {
  /** Função assíncrona 'up' é chamada quando a migração é executada para cima */
  async up(queryInterface, Sequelize) {
    // Adiciona a restrição de chave estrangeira para o campo 'usuario_id'
    await queryInterface.addConstraint('historico_jogos', {
      fields: ['usuario_id'], // Campo(s) da tabela de origem
      type: 'foreign key',
      name: 'historico_jogo_usuarios_fk', // Nome da chave estrangeira (deve ser único do BD)
      references:{
        table: 'usuarios', // Tabela estrangeira
        field: 'id'      // Campo da tabela estrangeira
      },
      onDelete: 'RESTRICT', // Não deixa apagar um usuário em uso no histórico de jogos
      onUpdate: 'CASCADE'   // Atualiza usuario_id em histórico de jogos se id em usuário mudar
    });

    // Adiciona a restrição de chave estrangeira para o campo 'jogo_id'
    await queryInterface.addConstraint('historico_jogos', {
      fields: ['jogo_id'], // Campo(s) da tabela de origem
      type: 'foreign key',
      name: 'historico_jogo_jogos_fk', // Nome da chave estrangeira (deve ser único do BD)
      references:{
        table: 'jogos', // Tabela estrangeira
        field: 'id'      // Campo da tabela estrangeira
      },
      onDelete: 'RESTRICT', // Não deixa apagar um jogo em uso no histórico de jogos
      onUpdate: 'CASCADE'   // Atualiza jogo_id em histórico de jogos se id em jogo mudar
    });
  },

  /** Função assíncrona 'down' é chamada quando a migração é revertida */
  async down(queryInterface, Sequelize) {
    // Remove a restrição de chave estrangeira para o campo 'jogo_id'
    await queryInterface.removeConstraint('historico_jogos', 'historico_jogo_jogos_fk');
    // Remove a restrição de chave estrangeira para o campo 'usuario_id'
    await queryInterface.removeConstraint('historico_jogos', 'historico_jogo_usuarios_fk');
  }
};
