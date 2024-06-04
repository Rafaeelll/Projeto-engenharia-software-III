const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
require('dotenv').config(); // Carregar variáveis de ambiente


const {host, port, user, pass} = require('../config/mailer.json')
// Configuração do transport do Nodemailer
const transport = nodemailer.createTransport({
 host,
 port,
 auth: {user, pass},
  
});

// Configuração do Handlebars
transport.use('compile', hbs({
  viewEngine: {
    extName: '.html',
    partialsDir: path.resolve(__dirname, '..', 'resources', 'mail'),
    layoutsDir: path.resolve(__dirname, '..', 'resources', 'mail'),
    defaultLayout: '',
  },
  viewPath: path.resolve(__dirname, '..', 'resources', 'mail'),
  extName: '.html',
}));

module.exports = transport;
