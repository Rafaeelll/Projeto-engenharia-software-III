'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('configuracoes', {
      fields: ['usuario_id'], //campo(s) da tabela de origem
      type: 'foreign key',
      name: 'configuracao_usuarios_fk', // nome da chave estrangeira (deve ser único do BD)
      references:{
        table: 'usuarios', //tabela estrangeira
        field: 'id'      // Campo da tabela estrangeira

      },
      onDelete: 'RESTRICT', // Não deixa apagar um usuario em uso no agendamento
      onUpdate: 'CASCADE'   // Atualiza usuario_id em agendamento se id em usuario mudar
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('configuracoes', 'configuracao_usuarios_fk')
  }
};
