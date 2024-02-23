/*
    Neste código, um roteador Express é definido para lidar com as solicitações relacionadas ao recurso "usuario". 
    As rotas estão configuradas para executar as funções apropriadas do controlador usuario. 
    Além disso, foram aplicados middlewares de autenticação e autorização em rotas específicas para garantir a segurança das operações. 
    O roteador é então exportado para ser utilizado em outros arquivos.
*/

const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuario');
const authenticateToken = require('../lib/authMiddleware'); // Importa o middleware de autenticação
const authorizationMiddleware = require('../lib/authorizationMiddleware'); // Importa o middleware de autorização
const multerConfig = require('../config/multer');

// Rota para criar um novo usuário
router.post('/', multerConfig.single('image'), controller.create);

// Rota para recuperar todos os usuários (requer autenticação)
router.get('/', authenticateToken, controller.retrieve);

// Rota para recuperar um usuário específico por ID (requer autenticação e autorização)
router.get('/:id', authenticateToken, authorizationMiddleware, controller.retrieveOne);

// Rota para atualizar um usuário específico por ID (requer autenticação e autorização)
router.put('/:id', authenticateToken, authorizationMiddleware, controller.update);

// Rota para excluir um usuário específico por ID (requer autenticação e autorização)
router.delete('/:id', authenticateToken, authorizationMiddleware, controller.delete);

// Rota para fazer login
router.post('/login', controller.login);

// Rota para fazer logout
router.post('/logout', controller.logout);

// Rota para cadastrar um novo usuário
router.post('/cadastro', multerConfig.single('image'), controller.cadastro);

module.exports = router;
