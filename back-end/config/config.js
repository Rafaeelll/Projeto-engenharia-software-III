// Este é um arquivo de configuração para bancos de dados usando o Sequelize, um ORM para Node.js. 
// Aqui está o que está acontecendo:

// O dotenv é utilizado para carregar variáveis de ambiente do arquivo .env para que elas possam ser acessadas em todo o aplicativo.
// O objeto exportado contém diferentes configurações para os ambientes development, test e production.
// As configurações de conexão com o banco de dados (como nome de usuário, senha,
//  nome do banco de dados, host e dialeto) são recuperadas das variáveis de ambiente.
// As configurações para cada ambiente são definidas dentro dos respectivos objetos (development, test, production).
// As configurações são acessadas posteriormente ao iniciar a conexão com o banco de dados usando o Sequelize.

// Carrega as variáveis de ambiente do arquivo .env
require('dotenv').config();

module.exports = {
  "development": {
    // Configurações para o ambiente de desenvolvimento
    "username": process.env.DB_USERNAME, // Nome de usuário do banco de dados
    "password": process.env.DB_PASSWORD, // Senha do banco de dados
    "database": process.env.DB_DATABASE, // Nome do banco de dados
    "host": process.env.DB_HOST,         // Host do banco de dados
    "dialect": process.env.DB_DIALECT,   // Dialeto do banco de dados (ex: mysql, postgres)
    // "define": {
    //   "underscored": true,
    //   "underscoredAll": true
    // }
  },
  "test": {
    // Configurações para o ambiente de teste
    "username": "root",                  // Nome de usuário do banco de dados de teste
    "password": null,                    // Senha do banco de dados de teste
    "database": "database_test",         // Nome do banco de dados de teste
    "host": "127.0.0.1",                 // Host do banco de dados de teste
    "dialect": "mysql",                  // Dialeto do banco de dados de teste
    // "define": {
    //   "underscored": true,
    //   "underscoredAll": true
    // }
  },
  "production": {
    // Configurações para o ambiente de produção
    "username": process.env.DB_USERNAME, // Nome de usuário do banco de dados de produção
    "password": process.env.DB_PASSWORD, // Senha do banco de dados de produção
    "database": process.env.DB_DATABASE, // Nome do banco de dados de produção
    "host": process.env.DB_HOST,         // Host do banco de dados de produção
    "dialect": process.env.DB_DIALECT,   // Dialeto do banco de dados de produção
    // "define": {
    //   "underscored": true,
    //   "underscoredAll": true
    // }
  }
}
