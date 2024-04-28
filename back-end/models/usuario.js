'use strict';
/*
  Este código define o modelo Usuario usando o Sequelize. 
  Ele descreve a estrutura da tabela de usuários e suas associações com outros modelos.
  Os campos definidos na tabela de usuários incluem id, nome, sobrenome, email, senha_acesso, 
  telefone, data_nasc, plataforma_fav, jogo_fav, image e primeiro_login.

  Além disso, o método associate define as associações do modelo Usuario com os modelos Agenda, 
  HistoricoJogo, Jogo, Visualizacao, Notificacao e Configuracao, indicando os relacionamentos 
  entre eles por meio de chaves estrangeiras.
  O modelo Usuario é configurado com escopos para controlar a exibição do campo senha_acesso. 
  O escopo padrão exclui o campo senha_acesso por padrão em operações de busca (retrieve), 
  enquanto o escopo withPassword inclui o campo senha_acesso quando necessário (por exemplo, para operações de login).
*/

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define as associações do modelo Usuario com outros modelos
      this.hasMany(models.Agenda, {
        foreignKey: 'usuario_id',    // Chave estrangeira na tabela Agenda
        sourceKey: 'id',              // Chave na tabela Usuario
        as: 'agendas'                // Alias para a associação
      });
      this.hasMany(models.HistoricoJogo, {
        foreignKey: 'usuario_id',    // Chave estrangeira na tabela HistoricoJogo
        sourceKey: 'id',              // Chave na tabela Usuario
        as: 'historico_jogos'        // Alias para a associação
      });
      this.hasMany(models.Jogo, {
        foreignKey: 'usuario_id',    // Chave estrangeira na tabela Jogo
        sourceKey: 'id',              // Chave na tabela Usuario
        as: 'jogos'                  // Alias para a associação
      });
      this.hasMany(models.Visualizacao, {
        foreignKey: 'usuario_id',    // Chave estrangeira na tabela Visualizacao
        sourceKey: 'id',              // Chave na tabela Usuario
        as: 'visualizacoes'          // Alias para a associação
      });
      this.hasMany(models.Notificacao, {
        foreignKey: 'usuario_id',    // Chave estrangeira na tabela Notificacao
        sourceKey: 'id',              // Chave na tabela Usuario
        as: 'notificacoes'           // Alias para a associação
      });
      this.hasOne(models.Configuracao, {
        foreignKey: 'usuario_id',    // Chave estrangeira na tabela Notificacao
        sourceKey: 'id',              // Chave na tabela Usuario
        as: 'configuracoes'           // Alias para a associação
      });
    }
  }

  // Definição dos campos e tipos na tabela Usuario
  Usuario.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    sobrenome: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(200),
      allowNull: false,
      unique: true
    },
    senha_acesso: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    telefone: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    data_nasc: {
      type: DataTypes.DATEONLY,
    },
    plataforma_fav: {
      type: DataTypes.ENUM('Twitch', 'Kick', 'Youtube', 'Facebook', 'Outros'),
    },
    jogo_fav: {
      type: DataTypes.STRING(50)
    },
    image:{
      type: DataTypes.STRING,
    },
    contagem_acesso:{
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    status:{
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
  }, {
    sequelize,
    modelName: 'Usuario',      // Nome do modelo
    tableName: 'usuarios',     // Nome da tabela no banco de dados

    // Define os escopos para ocultar ou exibir o campo senha_acesso
    defaultScope: {
      attributes: {
        exclude: ['senha_acesso']  // Exclui o campo senha_acesso por padrão
      }
    },
    scopes: {
      withPassword: {
        attributes: {
          include: ['senha_acesso']  // Inclui o campo senha_acesso
        }
      }
    }
  });

  return Usuario;
};
