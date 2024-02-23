'use strict';

// Este arquivo é responsável por configurar o Sequelize e importar todos os modelos da aplicação. 
// Ele lê todos os arquivos de modelo presentes no diretório atual, importa cada modelo e associa-os 
// ao objeto db. Em seguida, exporta o objeto db, contendo todos os modelos e a instância do Sequelize, 
// para ser usado em outras partes da aplicação.

// Importação de módulos
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');

// Definição de variáveis e constantes
const basename = path.basename(__filename); // Nome do arquivo atual
const env = process.env.NODE_ENV || 'development'; // Ambiente de execução
const config = require(__dirname + '/../config/config.js')[env]; // Configurações do banco de dados
const db = {}; // Objeto para armazenar os modelos Sequelize

// Inicialização do Sequelize
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Leitura dos arquivos no diretório atual
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 && // Ignora arquivos que começam com "."
      file !== basename && // Ignora o próprio arquivo atual
      file.slice(-3) === '.js' && // Considera apenas arquivos JavaScript
      file.indexOf('.test.js') === -1 // Ignora arquivos de teste
    );
  })
  .forEach(file => {
    // Importa o modelo e o adiciona ao objeto db
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Associa os modelos, se houver métodos de associação definidos
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Adiciona o objeto sequelize e o Sequelize ao objeto db
db.sequelize = sequelize;

module.exports = db; // Exporta o objeto db para uso em outras partes da aplicação
