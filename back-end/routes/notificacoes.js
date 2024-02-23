/*
    Neste código, um roteador Express é definido para lidar com as solicitações relacionadas ao recurso "notificacao". 
    Além das operações CRUD (Create, Retrieve, Update, Delete), existem duas rotas adicionais para agendar notificações de início e término. 
    Essas rotas são mapeadas para as funções correspondentes no controlador notificacao. 
    O roteador é então exportado para ser utilizado em outros arquivos.
*/

const express = require('express');
const router = express.Router();
const controller = require('../controllers/notificacao');

// Define as rotas CRUD para o recurso "notificacao"
router.post('/', controller.create); // Rota para criar uma nova notificação
router.get('/', controller.retrieve); // Rota para recuperar todas as notificações
router.get('/:id', controller.retrieveOne); // Rota para recuperar uma notificação específica por ID
router.put('/:id', controller.update); // Rota para atualizar uma notificação existente por ID
router.delete('/:id', controller.delete); // Rota para excluir uma notificação existente por ID

// Rotas para agendamento de notificações
router.post('/schedule-AlertStartNotifications', controller.scheduleAlertStartNotifications); // Rota para agendar notificações de início
router.post('/schedule-FinishAlertNotifications', controller.scheduleAlertFinishNotifications); // Rota para agendar notificações de término

// Exporta o roteador para ser utilizado em outros arquivos
module.exports = router;
