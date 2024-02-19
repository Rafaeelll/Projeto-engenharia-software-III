'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint('usuario_fotos', {
      fields: ['usuario_id'], //campo(s) da tabela de origem
      type: 'foreign key',
      name: 'usuario_fotos_usuarios_fk', // nome da chave estrangeira (deve ser único do BD)
      references:{
        table: 'usuarios', //tabela estrangeira
        field: 'id'      // Campo da tabela estrangeira

      },
      onDelete: 'RESTRICT', // Não deixa apagar um usuario em uso no agendamento
      onUpdate: 'CASCADE'   // Atualiza usuario_id em agendamento se id em usuario mudar
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('usuario_fotos', 'usuario_fotos_usuarios_fk')
  }
};
