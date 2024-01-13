const express = require('express');
const router = express.Router();
const controller = require('../controllers/notificacao');
const auth = require('../lib/auth') 


// Defina suas rotas
router.post('/', auth, controller.create);
router.get('/', auth, controller.retrieve);
router.get('/:id', auth, controller.retrieveOne);
router.put('/:id', auth, controller.update);
router.delete('/:id', auth, controller.delete);

// Rota para agendamento de notificações
// router.post('/schedule-AlertStartNotifications', auth, controller.scheduleAlertStartNotifications);
router.post('/schedule-FinishAlertNotifications', auth, controller.scheduleAlertFinishNotifications);
router.post('/schedule-StartNotification', auth, controller.scheduleStartNotifications)
// router.post('/schedule-FinishNotification', auth, controller.scheduleFinishNotifications)

// Exporte o router
module.exports = router;
