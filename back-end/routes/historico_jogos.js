/*
    Neste código, um roteador Express é criado para lidar com as solicitações HTTP relacionadas 
    às operações CRUD do histórico de jogo. Cada rota corresponde a uma função específica no 
    controlador historico_jogo, e as rotas são mapeadas para os métodos HTTP POST, GET, PUT e DELETE
*/
const express = require('express');
const router = express.Router();
const controller = require('../controllers/historico_jogo');

// Define as rotas para as operações CRUD do histórico de jogo
router.post('/', controller.create);
router.get('/', controller.retrieve);
router.get('/:id', controller.retrieveOne);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;