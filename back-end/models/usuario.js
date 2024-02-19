'use strict';
const aws = require('aws-sdk')
const s3 = new aws.S3()
const path = require("path");
const { promisify } = require("util");
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of DataTypes lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Agenda, {
        foreignKey: 'usuario_id',    // Campo da tabela estrangeira
        sourceKey: 'id',          // Campo da tabela local 
        as: 'agendas'  // Nome do campo de associação (plural)
      })
      this.hasMany(models.HistoricoJogo, {
        foreignKey: 'usuario_id',    // Campo da tabela estrangeira
        sourceKey: 'id',          // Campo da tabela local 
        as: 'historico_jogos'  // Nome do campo de associação (plural)
      })
      this.hasMany(models.Jogo, {
        foreignKey: 'usuario_id',    // Campo da tabela estrangeira
        sourceKey: 'id',          // Campo da tabela local 
        as: 'jogos'  // Nome do campo de associação (plural)
      })
      this.hasMany(models.Visualizacao, {
        foreignKey: 'usuario_id',    // Campo da tabela estrangeira
        sourceKey: 'id',          // Campo da tabela local 
        as: 'visualizacoes'  // Nome do campo de associação (plural)
      })
      this.hasMany(models.Notificacao, {
        foreignKey: 'usuario_id',    // Campo da tabela estrangeira
        sourceKey: 'id',          // Campo da tabela local 
        as: 'notificacoes'  // Nome do campo de associação (plural)
      })
      this.hasMany(models.Configuracao, {
        foreignKey: 'usuario_id',    // Campo da tabela estrangeira
        sourceKey: 'id',          // Campo da tabela local 
        as: 'configuracoes'  // Nome do campo de associação (plural)
      })
      this.hasMany(models.UsuarioFoto, {
        foreignKey: 'usuario_id',    // Campo da tabela estrangeira
        sourceKey: 'id',          // Campo da tabela local 
        as: 'usuario_fotos'  // Nome do campo de associação (plural)
      })
    }
  }
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
      type: DataTypes.STRING(50)
    },
    jogo_fav: {
      type: DataTypes.STRING(50)
    },
    /// user Img data
    name: {
      type: DataTypes.STRING
    },
    size: {
      type: DataTypes.FLOAT
    },
    key: {
      type: DataTypes.STRING
    },
    url: {
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    modelName: 'Usuario',
    tableName: 'usuarios',

    ///Esconde o campo "password" no retrieve e no retrieveOne
    defaultScope:{
      attributes:{
        exclude: ['senha_acesso']
      }
    },
    scopes: {
      // Inclui o campo "password" (necessario o login)
      withPassword:{
        attributes:{
          include: ['senha_acesso']
        }
      }
    }
  });

    // Função para definir a URL antes de criar um registro
  Usuario.beforeCreate((usuario, options) => {
    if (!usuario.url) {
        usuario.url = `${process.env.APP_URL}/files/${usuario.key}`;
    }
});
  Usuario.beforeDestroy(async (usuario, options) => {
    try {
        if (process.env.STORAGE_TYPE === "s3") {
            const response = await s3.deleteObject({
                Bucket: process.env.BUCKET_NAME,
                Key: usuario.key
            }).promise();
            console.log(response.status);
        } else {
            await promisify(fs.unlink)(
                path.resolve(__dirname, "..", "tmp", "uploads", usuario.key)
            );
        }
    } catch (error) {
        console.error(error);
    }
  });
  return Usuario;
};