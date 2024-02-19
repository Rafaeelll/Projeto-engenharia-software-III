'use strict';
const aws = require('aws-sdk')
const s3 = new aws.S3()
const path = require("path");
const { promisify } = require("util");

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UsuarioFoto extends Model {
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
    }
  }
  UsuarioFoto.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    usuario_id:{
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
    },
    size: {
      type: DataTypes.FLOAT,
    },
    key: {
      type: DataTypes.STRING,
    },
    url: {
      type: DataTypes.STRING,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'UsuarioFoto',
    tableName: 'usuario_fotos'
  });
     // Função para definir a URL antes de criar um registro
     UsuarioFoto.beforeCreate((usuarioFoto, options) => {
      if (!usuarioFoto.url) {
          usuarioFoto.url = `${process.env.APP_URL}/files/${usuarioFoto.key}`;
      }
  });
  // Dentro da definição do modelo UsuarioFoto
UsuarioFoto.beforeDestroy(async (usuarioFoto, options) => {
  try {
      if (process.env.STORAGE_TYPE === "s3") {
          const response = await s3.deleteObject({
              Bucket: process.env.BUCKET_NAME,
              Key: usuarioFoto.key
          }).promise();
          console.log(response.status);
      } else {
          await promisify(fs.unlink)(
              path.resolve(__dirname, "..", "tmp", "uploads", usuarioFoto.key)
          );
      }
  } catch (error) {
      console.error(error);
  }
});

  return UsuarioFoto;
};