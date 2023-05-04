'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('historico_jogos', {
      fields: ['usuario_id'], //campo(s) da tabela de origem
      type: 'foreign key',
      name: 'historico_jogo_usuarios_fk', // nome da chave estrangeira (deve ser único do BD)
      references:{
        table: 'usuarios', //tabela estrangeira
        field: 'id'      // Campo da tabela estrangeira

      },
      onDelete: 'RESTRICT', // Não deixa apagar um usuario em uso no agendamento
      onUpdate: 'CASCADE'   // Atualiza usuario_id em agendamento se id em usuario mudar
    })
    await queryInterface.addConstraint('historico_jogos', {
      fields: ['jogo_id'], //campo(s) da tabela de origem
      type: 'foreign key',
      name: 'historico_jogo_jogos_fk', // nome da chave estrangeira (deve ser único do BD)
      references:{
        table: 'jogos', //tabela estrangeira
        field: 'id'      // Campo da tabela estrangeira

      },
      onDelete: 'RESTRICT', // Não deixa apagar um usuario em uso no agendamento
      onUpdate: 'CASCADE'   // Atualiza usuario_id em agendamento se id em usuario mudar
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('historico_jogos', 'historico_jogo_jogos_fk')
    await queryInterface.removeConstraint('historico_jogos', 'historico_jogo_usuarios_fk')
  }
};
