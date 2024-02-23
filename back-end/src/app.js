/*
Neste código, um servidor Express é configurado para lidar com as solicitações HTTP da aplicação. 
São definidos middlewares para tratar o log, análise de cookies, análise de corpo de requisição e servir arquivos estáticos. 
Além disso, são configurados middlewares para habilitar o CORS, autenticação, e tratamento de erros de conexão com o banco de dados.
As rotas da aplicação são definidas e associadas aos respectivos arquivos de rota. Cada rota possui seu próprio controlador, 
responsável por lidar com as requisições HTTP e responder adequadamente.

*/

// Carrega as variáveis de ambiente do arquivo .env para a aplicação
require('dotenv').config();

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();

const cors = require('cors');

// Habilita que apenas o front-end indicado na variável process.env.FRONT_ORIGIN possa acessar o back-end
app.use(cors({
   origin: process.env.FRONT_ORIGIN,
   credentials: true // Exige o envio de cookie com credenciais
 }));

// Conexão ao BD ------------------------------------------
const db = require('../models');

try {
    db.sequelize.authenticate();
    console.log('SEQUELIZE: connection has been established successfully.');
} catch(error) {
    console.log('* SEQUELIZE: unable to connect to the database: ', error);
    process.exit(1);
}

app.use(logger('dev'));
app.use(express.json());
app.use((req, res, next) => {
   // Define os tipos de método que a API aceita
   res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");

   // Permite o envio de dados para a API
   res.header("Access-Control-Allow-Headers", "Content-Type");

   // Continua o processamento quando não houver erro
   next();
});

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/files", express.static(path.resolve(__dirname, "..", "tmp", "uploads")));

// Chama a verificação de autenticação para qualquer rota
const auth = require('../lib/auth');
app.use(auth);

/********************* ROTAS *****************************/
const usuarios = require('../routes/usuarios');
app.use('/usuarios', usuarios);

const agendas = require('../routes/agendas');
app.use('/agendas', agendas);

const jogos = require('../routes/jogos');
app.use('/jogos', jogos);

const historicoJogos = require('../routes/historico_jogos');
app.use('/historico_jogos', historicoJogos);

const notificacoes = require('../routes/notificacoes');
app.use('/notificacoes', notificacoes);

const visualizacoes = require('../routes/visualizacoes');
app.use('/visualizacoes', visualizacoes);

module.exports = app;
