/*
    Este código define um conjunto de rotas usando o Express.js. 
    Ele cria um roteador (router) que manipula as solicitações HTTP para operações CRUD 
    (criação, recuperação, atualização e exclusão) relacionadas à agenda, com cada rota 
    correspondendo a uma função específica no controlador agenda. As rotas são mapeadas
    para endpoints HTTP como POST, GET, PUT e DELETE.
*/

const express = require('express');
const router = express.Router();
const controller = require('../controllers/agenda');

// Define as rotas para as operações CRUD da agenda
router.post('/', controller.create);
router.put('/update-status', controller.updateAgendaStatusAuto); // Usar PUT para atualizações
router.get('/', controller.retrieve);
router.get('/:id', controller.retrieveOne);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);
router.get('/status/:status', controller.retrieveByStatus);


module.exports = router;
