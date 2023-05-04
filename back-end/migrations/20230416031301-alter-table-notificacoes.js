'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('notificacoes', {
      fields: ['usuario_id'], //campo(s) da tabela de origem
      type: 'foreign key',
      name: 'notificacao_usuarios_fk', // nome da chave estrangeira (deve ser único do BD)
      references:{
        table: 'usuarios', //tabela estrangeira
        field: 'id'      // Campo da tabela estrangeira

      },
      onDelete: 'RESTRICT', // Não deixa apagar um usuario em uso no agendamento
      onUpdate: 'CASCADE'   // Atualiza usuario_id em agendamento se id em usuario mudar
    })
    await queryInterface.addConstraint('notificacoes', {
      fields: ['agenda_id'], //campo(s) da tabela de origem
      type: 'foreign key',
      name: 'notificacao_agendas_fk', // nome da chave estrangeira (deve ser único do BD)
      references:{
        table: 'agendas', //tabela estrangeira
        field: 'id'      // Campo da tabela estrangeira

      },
      onDelete: 'RESTRICT', // Não deixa apagar um usuario em uso no agendamento
      onUpdate: 'CASCADE'   // Atualiza usuario_id em agendamento se id em usuario mudar
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('notificacoes', 'notificacao_agendas_fk')
    await queryInterface.removeConstraint('notificacoes', 'notificacao_usuarios_fk')
  }
};
