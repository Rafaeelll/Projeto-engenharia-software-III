const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuario')

router.post('/', controller.create)
router.get('/', controller.retrieve)
router.get('/:id', controller.retrieveOne)
router.put('/:id', controller.update)
router.delete('/:id', controller.delete)
router.post('/cadastro', controller.cadastro)
router.post('/login', controller.login)
router.post('/logout', controller.logout)

module.exports = router;