/*
    Neste código, um roteador Express é definido para lidar com as solicitações relacionadas ao recurso "usuario". 
    As rotas estão configuradas para executar as funções apropriadas do controlador usuario. 
    Além disso, foram aplicados middlewares de autenticação e autorização em rotas específicas para garantir a segurança das operações. 
    O roteador é então exportado para ser utilizado em outros arquivos.
*/

const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuario');
const multerConfig = require('../config/multer');

// Rota para fazer login
router.post('/login', controller.login);

router.post('/esqueci_senha', controller.esqueciSenha);

// Rota para redefinir/recuperar senha
router.post('/recuperar_senha', controller.recuperSenha);

// Rota para fazer logout
router.post('/logout', controller.logout);

router.post('/logout2', controller.logout2);

// Rota para cadastrar um novo usuário
router.post('/cadastro', multerConfig.single('image'), controller.cadastro);

router.post('/confirmar_cadastro', controller.confirmarCadastro);

// Rota para recuperar todos os usuários (requer autenticação)
router.get('/', controller.retrieve);

// Rota para recuperar um usuário específico por ID (requer autenticação e autorização)
router.get('/:id', controller.retrieveOne);

// Rota para atualizar um usuário específico por ID (requer autenticação e autorização)
router.put('/profile/:id', controller.updateUserProfile);

router.put('/account_status/:id', controller.updateUserAccountStatus);

router.put('/minha_conta/:id', controller.updateMyAccount);

router.put('/image/:id', multerConfig.single('image'), controller.updateUserImg);

// Rota para excluir um usuário específico por ID (requer autenticação e autorização)
router.delete('/:id', controller.delete);

router.delete('/:id', controller.deleteInactiveUsers);

module.exports = router;
