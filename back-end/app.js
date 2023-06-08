// Carrega as variaveis de ambiente do arquivo
//.env para aplicação
require('dotenv').config()

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');



var app = express();

// Habilita que apenas o front-end indicado
// na variável process.env.FRONT_ORIGIN possa
// acessar o back-end
const cors = require('cors')
app.use(cors({
  origin: process.env.FRONT_ORIGIN,
  credentials: true // Exige o envio de cookie com credenciais
}))

// Conexão ao BD ------------------------------------------
 const db = require('./models')

 try {
    db.sequelize.authenticate()
console.log('SEQUELIZE: connection has been established sucessfully.')

 }
 catch(error){
    console.log('* SEQUELIZE: unable to connect to the database: ', error)
    process.exit(1)
 }
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// chama a verificação de autenticação para todas as rotas, exceto a rota de cadastro de usuários
const auth = require('./lib/auth');

// ...

app.use((req, res, next) => {
  if (req.url === '/usuarios/cadastro' && req.method === 'POST') {
    // Ignora a verificação de autenticação para a rota de cadastro de usuários
    next();
  } else {
    auth(req, res, next);
  }
});

// Resto do código...



/*********************ROTAS*****************************/
const usuarios = require('./routes/usuarios')
app.use('/usuarios', usuarios)

const agendas = require('./routes/agendas')
app.use('/agendas', agendas)

const jogos = require('./routes/jogos')
app.use('/jogos', jogos)

const historicoJogos = require('./routes/historico_jogos')
app.use('/historico_jogos', historicoJogos)

const notificacoes = require('./routes/notificacoes')
app.use('/notificacoes', notificacoes)

const visualizacoes = require('./routes/visualizacoes')
app.use('/visualizacoes', visualizacoes)

const configuracoes = require('./routes/configuracoes')
app.use('/configuracoes', configuracoes)
module.exports = app;
