const express = require('express');
const router = express.Router();
const controller = require('../controllers/configuracao');

// Define as rotas para as operações CRUD da agenda
router.post('/', controller.create);
router.get('/', controller.retrieve);
router.get('/:id', controller.retrieveOne);
router.put('/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;
