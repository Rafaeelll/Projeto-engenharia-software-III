/*
Neste código, um roteador Express é definido para lidar com as solicitações relacionadas ao recurso "visualizacao". 
As rotas são configuradas para executar as funções apropriadas do controlador visualizacao. 
Cada rota corresponde a uma operação CRUD (Create, Retrieve, Update, Delete) sobre o recurso de visualização. 
O roteador é exportado para ser utilizado em outros arquivos.

*/

const express = require('express');
const router = express.Router();
const controller = require('../controllers/visualizacao');

// Rota para criar uma nova visualização
router.post('/', controller.create);

// Rota para recuperar todas as visualizações
router.get('/', controller.retrieve);

// Rota para recuperar uma visualização específica por ID
router.get('/:id', controller.retrieveOne);

// Rota para atualizar uma visualização específica por ID
router.put('/:id', controller.update);

// Rota para excluir uma visualização específica por ID
router.delete('/:id', controller.delete);

module.exports = router;
