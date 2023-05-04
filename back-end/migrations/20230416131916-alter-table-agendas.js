'use strict';

/// Agendas (alter-table).

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    //criar a chave estrangeira da tabela agenda para tabela agendamentos
    await queryInterface.addConstraint('agendas', {
      fields: ['usuario_id'], //campo(s) da tabela de origem
      type: 'foreign key',
      name: 'agenda_usuario_fk', // nome da chave estrangeira (deve ser único do BD)
      references:{
        table: 'usuarios', //tabela estrangeira
        field: 'id'      // Campo da tabela estrangeira

      },
      onDelete: 'RESTRICT', // Não deixa apagar um usuario em uso no agendamento
      onUpdate: 'CASCADE'   // Atualiza usuario_id em agendamento se id em usuario mudar
    })
    await queryInterface.addConstraint('agendas', {
      fields: ['jogo_id'], //campo(s) da tabela de origem
      type: 'foreign key',
      name: 'agenda_jogos_fk', // nome da chave estrangeira (deve ser único do BD)
      references:{
        table: 'jogos', //tabela estrangeira
        field: 'id'      // Campo da tabela estrangeira

      },
      onDelete: 'RESTRICT', // Não deixa apagar um usuario em uso no agendamento
      onUpdate: 'CASCADE'   // Atualiza usuario_id em agendamento se id em usuario mudar
    })

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('agendas', 'agenda_jogos_fk')
    await queryInterface.removeConstraint('agendas', 'agenda_usuario_fk')

  }
};
