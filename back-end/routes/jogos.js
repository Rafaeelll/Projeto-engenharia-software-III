/*
    Neste código, um roteador Express é definido para lidar com as solicitações relacionadas ao recurso "jogo". 
    As rotas são configuradas para executar as funções correspondentes no controlador jogo quando uma solicitação 
    HTTP é feita para esses endpoints específicos. As operações CRUD (Create, Retrieve, Update, Delete) são mapeadas 
    para os métodos HTTP POST, GET, PUT e DELETE, respectivamente. O roteador é então exportado para ser utilizado em outros arquivos.

*/

const express = require('express');
const router = express.Router();
const controller = require('../controllers/jogo');

// Define as rotas CRUD para o recurso "jogo"
router.post('/', controller.create); // Rota para criar um novo jogo
router.get('/', controller.retrieve); // Rota para recuperar todos os jogos
router.get('/:id', controller.retrieveOne); // Rota para recuperar um jogo específico por ID
router.put('/:id', controller.update); // Rota para atualizar um jogo existente por ID
router.delete('/:id', controller.delete); // Rota para excluir um jogo existente por ID

module.exports = router;
