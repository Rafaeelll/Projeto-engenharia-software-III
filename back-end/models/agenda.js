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

      // Cada agenda pertence a um jogo
      this.belongsTo(models.Jogo, {
        foreignKey: 'jogo_id',    // Nome do campo na tabela de ORIGEM
        targetKey: 'id',           // Nome do campo na tabela de DESTINO
        as: 'jogo'                 // Nome do atributo para exibição
      });

      // Cada agenda pode ter várias visualizações
      this.hasMany(models.Visualizacao, {
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
    jogo_id:{
      type: DataTypes.INTEGER,
      allowNull: false
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
      type: DataTypes.STRING(100)
    },
    descricao:{
      type: DataTypes.TEXT,
    },
    status:{
      type: DataTypes.ENUM('Agendado', 'Em andamento', 'Finalizada'),
      allowNull: false
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
          statusAgenda = "Em andamento";
        } else if (dataAtual > dataFinal) {
          statusAgenda = "Finalizada";
        }

        // Definir o status da agenda
        agenda.status = statusAgenda;


      // Determinar a date e horario do inicio e fim da pausa caso a agenda tiver uma duração maior ou igual a 3 hrs
      const inicio_agenda = new Date(agenda.data_horario_inicio).getTime(); // Obtém o tempo em milissegundos
      const fim_agenda = new Date(agenda.data_horario_fim).getTime(); // Obtém o tempo em milissegundos

      // Calcular a duração da agenda em milissegundos
      const duracao = fim_agenda - inicio_agenda;

      if (duracao >= 3 * 60 * 60 * 1000) { // Se a duração for maior ou igual a 3 horas
        // Calcular a metade da duração da agenda em milissegundos
        const metadeDuracao = duracao / 2;

        // Calcular a data e hora de início da pausa (metade da duração da agenda)
        const dataInicioPausa = new Date(inicio_agenda + metadeDuracao);

        // Calcular a data e hora de término da pausa (10 minutos após o início da pausa)
        const dataFimPausa = new Date(dataInicioPausa.getTime() + 10 * 60 * 1000); // Adiciona 10 minutos em milissegundos

        // Definir os valores para os campos p_data_horario_inicio e p_data_horario_fim
        agenda.p_data_horario_inicio = dataInicioPausa;
        agenda.p_data_horario_fim = dataFimPausa;
      }
    }
  }
});
  
  return Agenda;
};
