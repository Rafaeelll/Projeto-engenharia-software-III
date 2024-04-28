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
    config: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {
        confirmar_auto_ini: false,
        confirmar_auto_fim: false,
        notificar_hora_antes_inicio: true, // Padrão: notificar 1 hora antes da inicialização
        notif_trinta_min_antes_inicio: false, 
        notif_no_inicio: false, 
        notificar_no_fim: true, // Padrão: notificar na hora exata finalização
        notificar_hora_antes_fim: false,
        notif_trinta_min_antes_fim: false, 
      }
    },
  }, {
    sequelize,
    modelName: 'Configuracao',
    tableName: 'configuracoes'
  });
  return Configuracao;
};