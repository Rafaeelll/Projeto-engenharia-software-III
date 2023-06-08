'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('visualizacoes', {
      fields: ['usuario_id'], //campo(s) da tabela de origem
      type: 'foreign key',
      name: 'visualizacao_usuarios_fk', // nome da chave estrangeira (deve ser único do BD)
      references:{
        table: 'usuarios', //tabela estrangeira
        field: 'id'      // Campo da tabela estrangeira

      },
      onDelete: 'RESTRICT', // Não deixa apagar um usuario em uso no agendamento
      onUpdate: 'CASCADE'   // Atualiza usuario_id em agendamento se id em usuario mudar
    })
    await queryInterface.addConstraint('visualizacoes', {
      fields: ['agenda_id'], //campo(s) da tabela de origem
      type: 'foreign key',
      name: 'visualizacao_agendas_fk', // nome da chave estrangeira (deve ser único do BD)
      references:{
        table: 'agendas', //tabela estrangeira
        field: 'id'      // Campo da tabela estrangeira

      },
      onDelete: 'RESTRICT', // Não deixa apagar um usuario em uso no agendamento
      onUpdate: 'CASCADE'   // Atualiza usuario_id em agendamento se id em usuario mudar
    })

    await queryInterface.addConstraint('visualizacoes', {
      fields: ['jogo_id'], //campo(s) da tabela de origem
      type: 'foreign key',
      name: 'visualizacao_jogos_fk', // nome da chave estrangeira (deve ser único do BD)
      references:{
        table: 'jogos', //tabela estrangeira
        field: 'id'      // Campo da tabela estrangeira

      },
      onDelete: 'RESTRICT', // Não deixa apagar um usuario em uso no agendamento
      onUpdate: 'CASCADE'   // Atualiza usuario_id em agendamento se id em usuario mudar
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('visualizacoes', 'visualizacao_jogos_fk')
    await queryInterface.removeConstraint('visualizacoes', 'visualizacao_agendas_fk')
    await queryInterface.removeConstraint('visualizacoes', 'visualizacao_usuarios_fk')
  }
};
