const express = require('express');
const router = express.Router();
const controller = require('../controllers/notificacao');
const authorizationMiddleware = require('../lib/authorizationMiddleware'); // Importe o middleware de autorização

// Defina suas rotas
router.post('/', authorizationMiddleware, controller.create);
router.get('/', authorizationMiddleware, controller.retrieve);
router.get('/:id', authorizationMiddleware, controller.retrieveOne);
router.put('/:id', authorizationMiddleware, controller.update);
router.delete('/:id', authorizationMiddleware, controller.delete);

// Rota para agendamento de notificações
router.post('/schedule-AlertStartNotifications', authorizationMiddleware, controller.scheduleAlertStartNotifications);
router.post('/schedule-FinishAlertNotifications', authorizationMiddleware, controller.scheduleAlertFinishNotifications);
router.post('/schedule-StartNotification', authorizationMiddleware, controller.scheduleStartNotifications)
router.post('/schedule-FinishNotification', authorizationMiddleware, controller.scheduleFinishNotifications)

// Exporte o router
module.exports = router;
