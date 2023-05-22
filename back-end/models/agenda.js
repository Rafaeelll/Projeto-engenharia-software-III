'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Agenda extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Usuario,{
        foreignKey: 'usuario_id', // Nome do campo na tabela de ORIGEM
        targetKey: 'id',       // Nome do campo na tabela de DESTINO
        as: 'usuario'             // Nome do atributo para exibição
      })
      this.belongsTo(models.Jogo,{
        foreignKey: 'jogo_id', // Nome do campo na tabela de ORIGEM
        targetKey: 'id',       // Nome do campo na tabela de DESTINO
        as: 'jogo'             // Nome do atributo para exibição
      })
      this.hasMany(models.Visualizacao, {
        foreignKey: 'agenda_id',    // Campo da tabela estrangeira
        sourceKey: 'id',          // Campo da tabela local 
        as: 'visualizacoes'  // Nome do campo de associação (plural)
      })
      this.hasMany(models.Notificacao, {
        foreignKey: 'agenda_id',    // Campo da tabela estrangeira
        sourceKey: 'id',          // Campo da tabela local 
        as: 'notificacoes'  // Nome do campo de associação (plural)
      })
    }
  }
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
      allowNull: false,
    },
    data_agenda:{
      type: DataTypes.DATE,
      allowNull: false,
    },
    horario_inicio:{
      type: DataTypes.DATE,
      allowNull: false
    },
    horario_fim:{
      type: DataTypes.DATE,
      allowNull: false,
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
      allowNull: false,
    },
    status:{
      type: DataTypes.ENUM('Agendado', 'Em andamento', 'Finalizada'),
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Agenda',
    tableName: 'agendas'
  });
  return Agenda;
};