'use strict';

// Neste código, um modelo DataTypes chamado Agenda é definido. Ele descreve a estrutura da 
// tabela agendas em um banco de dados relacional, incluindo os tipos de dados de cada coluna, 
// restrições de chave estrangeira e associações com outros modelos (como Usuario, Jogo, Visualizacao e Notificacao). 
// O método associate define essas associações entre os modelos. Cada agenda pertence a um usuário e a um jogo, e pode 
// ter várias visualizações e notificações associadas a ela.

const { Model } = require('sequelize');

/**
 * O arquivo define o modelo 'Agenda' usando o DataTypes.
 */

module.exports = (sequelize, DataTypes) => {
  class Agenda extends Model {
    /**
     * Método auxiliar para definir associações.
     * Este método não faz parte do ciclo de vida do DataTypes.
     * O arquivo `models/index` chamará este método automaticamente.
     */
    static associate(models) {
      // Define as associações entre os modelos

      // Cada agenda pertence a um usuário
      this.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id', // Nome do campo na tabela de ORIGEM
        targetKey: 'id',          // Nome do campo na tabela de DESTINO
        as: 'usuario'             // Nome do atributo para exibição
      });

      // relação N para N
      this.belongsToMany(models.Jogo, {
        through: 'agenda_jogos',
        foreignKey: 'agenda_id',    // Nome do campo na tabela de ORIGEM
        otherKey: 'jogo_id',           // Nome do campo na tabela de DESTINO
        as: 'jogos'                 // Nome do atributo para exibição
      });

      // Cada agenda pode ter uma visualização
      this.hasOne(models.Visualizacao, {
        foreignKey: 'agenda_id',   // Campo da tabela estrangeira
        sourceKey: 'id',           // Campo da tabela local 
        as: 'visualizacoes'        // Nome do campo de associação (plural)
      });

      // Cada agenda pode ter várias notificações
      this.hasMany(models.Notificacao, {
        foreignKey: 'agenda_id',   // Campo da tabela estrangeira
        sourceKey: 'id',           // Campo da tabela local 
        as: 'notificacoes'         // Nome do campo de associação (plural)
      });
      this.belongsTo(models.Configuracao, {
        foreignKey: 'config_id',
        targetKey: 'id',
        as: 'configuracao'
      })
    }
  }

  // Define a estrutura da tabela 'agendas' e suas propriedades
  Agenda.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    config_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    jogos_associados:{
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: '[]'

    },
    data_horario_inicio:{ // Data e horario do inicio da agenda
      type: DataTypes.DATE,
      allowNull: false
    },
    data_horario_fim:{ // Data e horario do fim da agenda
      type: DataTypes.DATE,
      allowNull: false,
    },
    p_data_horario_inicio:{ // data e horario do inicio da pausa (opcional para agendas com durações menor do que 3hrs)
      type: DataTypes.DATE,
    },
    p_data_horario_fim:{ // data e horario do fim da pausa.
      type: DataTypes.DATE,
    },
    titulo_agenda:{
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    plt_transm:{
      type: DataTypes.ENUM('Twitch', 'Kick', 'Youtube', 'Facebook', 'Outros'),
      allowNull: false
    },
    descricao:{
      type: DataTypes.TEXT,
    },
    confirmacao_presenca: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    confirmacao_finalizacao: {
      type: DataTypes.BOOLEAN,
      defaultValue: false

    },
    status:{
      type: DataTypes.ENUM('Agendado', 'Inicialização Pendente', 'Inicialização Confirmada', 'Em andamento', 'Finalizada', 'Finalização Pendente', 'Finalização Confirmada'),
      defaultValue: 'Agendado'
    },
  }, {
    sequelize,
    modelName: 'Agenda',   // Nome do modelo
    tableName: 'agendas',    // Nome da tabela no banco de dados
    hooks: {
      // Hook executado antes de criar um registro de agenda
      beforeCreate: (agenda, options) => {
        // Determinar o status da agenda com base na data e hora atual
        const dataAtual = new Date();
        const dataInicial = new Date(agenda.data_horario_inicio);
        const dataFinal = new Date(agenda.data_horario_fim);

        let statusAgenda = "Agendado";

        if (dataAtual >= dataInicial && dataAtual <= dataFinal) {
          statusAgenda = "Inicialização Pendente";
        } else if (dataAtual > dataFinal) {
          statusAgenda = "Finalização Pendente";
        }

        // Definir o status da agenda
        agenda.status = statusAgenda;    
      },
      beforeUpdate: (agenda, options) => {
        // Determinar o status da agenda com base na data e hora atual
        const dataAtual = new Date();
        const dataInicial = new Date(agenda.data_horario_inicio);
        const dataFinal = new Date(agenda.data_horario_fim);

        let statusAgenda = "Agendado";

        if (dataAtual >= dataInicial && dataAtual <= dataFinal) {
          statusAgenda = "Inicialização Pendente";
        } else if (dataAtual > dataFinal) {
          statusAgenda = "Finalização Pendente";
        }

        // Definir o status da agenda
        agenda.status = statusAgenda;    
      },
    }
});
  
  return Agenda;
};
