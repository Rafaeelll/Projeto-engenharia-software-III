const express = require('express');
const router = express.Router();
const controller = require('../controllers/notificacao');


// Defina suas rotas
router.post('/', controller.create);
router.get('/', controller.retrieve);
router.get('/:id', controller.retrieveOne);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

// Rota para agendamento de notificações
// router.post('/schedule-AlertStartNotifications', auth, controller.scheduleAlertStartNotifications);
router.post('/schedule-FinishAlertNotifications', controller.scheduleAlertFinishNotifications);
router.post('/schedule-StartNotification', controller.scheduleStartNotifications)
// router.post('/schedule-FinishNotification', auth, controller.scheduleFinishNotifications)

// Exporte o router
module.exports = router;
