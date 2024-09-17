'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Configuracao extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id', // Nome do campo na tabela de ORIGEM
        targetKey: 'id',          // Nome do campo na tabela de DESTINO
        as: 'usuario'             // Nome do atributo para exibição
      });

      this.hasMany(models.Notificacao, {
        foreignKey: 'config_id',   // Campo da tabela estrangeira
        sourceKey: 'id',           // Campo da tabela local 
        as: 'notificacoes'         // Nome do campo de associação (plural)
      });

      this.hasMany(models.Agenda, {
        foreignKey: 'config_id',   // Campo da tabela estrangeira
        sourceKey: 'id',           // Campo da tabela local 
        as: 'agendas'         // Nome do campo de associação (plural)
      });
    }
  }
  Configuracao.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    usuario_id:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    confirmar_auto_ini: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    confirmar_auto_fim: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    horario_notif_inicio: {
      type: DataTypes.ENUM('1 Hora Antes (Padrão)', '30 minutos antes', 'No Início'),
      allowNull: false,

    },
    horario_notif_fim: {
      type: DataTypes.ENUM('1 Hora Antes', '30 minutos antes', 'No Fim (Padrão)'),
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Configuracao',
    tableName: 'configuracoes'
  });
  return Configuracao;
};