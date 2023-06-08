'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Jogo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Agenda, {
        foreignKey: 'jogo_id',    // Campo da tabela estrangeira
        sourceKey: 'id',          // Campo da tabela local 
        as: 'agendas'  // Nome do campo de associação (plural)
      })
      this.hasMany(models.Visualizacao, {
        foreignKey: 'jogo_id',    // Campo da tabela estrangeira
        sourceKey: 'id',          // Campo da tabela local 
        as: 'visualizacoes'  // Nome do campo de associação (plural)
      })
      this.hasMany(models.HistoricoJogo, {
        foreignKey: 'jogo_id',    // Campo da tabela estrangeira
        sourceKey: 'id',          // Campo da tabela local 
        as: 'historico_jogos'  // Nome do campo de associação (plural)
      })
    }
  }
  Jogo.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    nome: {
      type: DataTypes.STRING(50),
      allowNull:false
    },
    data_jogo: {
      type: DataTypes.DATE,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Jogo',
    tableName: 'jogos'
  });
  return Jogo;
};