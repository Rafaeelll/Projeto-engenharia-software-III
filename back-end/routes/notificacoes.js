/*
    Neste código, um roteador Express é definido para lidar com as solicitações relacionadas ao recurso "notificacao". 
    Além das operações CRUD (Create, Retrieve, Update, Delete), existem duas rotas adicionais para agendar notificações de início e término. 
    Essas rotas são mapeadas para as funções correspondentes no controlador notificacao. 
    O roteador é então exportado para ser utilizado em outros arquivos.
*/

const express = require('express');
const router = express.Router();
const controller = require('../controllers/notificacao');
const send = require('../controllers/pushNotification')


// Define as rotas CRUD para o recurso "notificacao"
router.post('/', controller.createAutomaticStartNotifications); // Rota para criar uma nova notificação
router.post('/', controller.createAutomaticFinishNotifications); 
router.post('/atualizar_status/:agenda_id', controller.updateAgendaConfirmation);
router.post('/push/register', controller.register)
router.post('/push/send', send)
router.post('/atualizar_notif', controller.updateNotificationCount);
router.get('/contagem', controller.retrieveNotificationCount);
router.get('/push/public_key', controller.publicKey)
router.get('/', controller.retrieve); // Rota para recuperar todas as notificações
router.get('/:id', controller.retrieveOne); // Rota para recuperar uma notificação específica por ID
router.delete('/:id', controller.delete); // Rota para excluir uma notificação existente por ID

// Exporta o roteador para ser utilizado em outros arquivos
module.exports = router;
