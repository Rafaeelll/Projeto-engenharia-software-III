const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuario');
const authenticateToken = require('../lib/authMiddleware'); // Importe o middleware de autenticação
const authorizationMiddleware = require('../lib/authorizationMiddleware') // Importe o middleware de autorização

router.post('/', controller.create);
router.get('/', authenticateToken, controller.retrieve); // Aplica o middleware de autenticação
router.get('/:id', authenticateToken, authorizationMiddleware, controller.retrieveOne); // Aplica os middlewares de autenticação e autorização
router.put('/:id', authenticateToken, authorizationMiddleware, controller.update); // Aplica os middlewares de autenticação e autorização
router.delete('/:id', authenticateToken, authorizationMiddleware, controller.delete); // Aplica os middlewares de autenticação e autorização
router.post('/login', controller.login);
router.post('/logout', controller.logout);
router.post('/cadastro', controller.cadastro);

module.exports = router;
