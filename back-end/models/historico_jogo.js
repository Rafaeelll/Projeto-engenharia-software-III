'use strict';
// Este código define o modelo HistoricoJogo utilizando o DataTypes para lidar com a interação com o banco de dados. 
// Ele inclui definições de associações com os modelos Usuario e Jogo, especificando as chaves estrangeiras e os 
// atributos para exibição. Além disso, define os campos da tabela historico_jogos, como id, usuario_id, jogo_id, pontuacao e createdAt

const { Model } = require('sequelize');

// Definição do modelo HistoricoJogo usando o DataTypes
module.exports = (sequelize, DataTypes) => {
  class HistoricoJogo extends Model {
    // Método auxiliar para definir associações entre modelos
    static associate(models) {
      // Associação com o modelo Usuario
      this.belongsTo(models.Usuario, {
        foreignKey: 'usuario_id', // Nome do campo na tabela de ORIGEM
        targetKey: 'id',          // Nome do campo na tabela de DESTINO
        as: 'usuario'             // Nome do atributo para exibição
      });

      // Associação com o modelo Jogo
      this.belongsTo(models.Jogo, {
        foreignKey: 'jogo_id',    // Nome do campo na tabela de ORIGEM
        targetKey: 'id',          // Nome do campo na tabela de DESTINO
        as: 'jogo'                // Nome do atributo para exibição
      });
    }
  }

  // Inicialização do modelo HistoricoJogo
  HistoricoJogo.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    usuario_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    jogo_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nivel: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    jogo_status:{
      type: DataTypes.ENUM('Não iniciado', 'Em progresso', 'Concluído'),
      defaultValue: 'Não iniciado',
    },
    jogo_iniciado:{
      type: DataTypes.BOOLEAN,
    },
    jogo_zerado:{
      type: DataTypes.BOOLEAN,
    },
    avaliacao: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: true,
      validate: {
        min: 1,
        max: 5
      }
    },
    comentario_usuario:{
      type: DataTypes.TEXT
    },
  }, {
    sequelize,
    modelName: 'HistoricoJogo', // Nome do modelo
    tableName: 'historico_jogos' // Nome da tabela no banco de dados
  });

  return HistoricoJogo;
};
